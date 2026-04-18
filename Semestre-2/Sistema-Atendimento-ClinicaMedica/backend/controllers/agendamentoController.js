const Agendamento = require('../models/Agendamento');
const Usuario = require('../models/Usuario');
const axios = require('axios');

const FORECAST_WINDOW_DAYS = 5;
const WEATHER_CODE_MAP = {
  0: 'Ceu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Encoberto',
  45: 'Nevoeiro',
  48: 'Nevoeiro com geada',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa intensa',
  56: 'Garoa congelante leve',
  57: 'Garoa congelante intensa',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  66: 'Chuva congelante leve',
  67: 'Chuva congelante forte',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve intensa',
  77: 'Graos de neve',
  80: 'Pancadas de chuva leves',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva fortes',
  85: 'Pancadas de neve leves',
  86: 'Pancadas de neve fortes',
  95: 'Tempestade',
  96: 'Tempestade com granizo leve',
  99: 'Tempestade com granizo forte'
};

const normalizarCEP = (cep = '') => cep.replace(/\D/g, '');

const parseDataHoraConsulta = (dataConsulta, horario) => {
  const data = new Date(`${dataConsulta}T${horario}:00`);
  return Number.isNaN(data.getTime()) ? null : data;
};

const obterForecastUrl = () => process.env.WEATHER_FORECAST_API_URL || 'https://api.open-meteo.com/v1/forecast';
const obterGeoUrl = () => process.env.WEATHER_GEOCODING_API_URL || 'https://geocoding-api.open-meteo.com/v1/search';

const criarClimaIndisponivel = (motivoIndisponibilidade) => ({
  disponivel: false,
  motivoIndisponibilidade
});

const montarConsultasEndereco = (endereco = {}) => {
  const consultas = [];
  const consultaCompleta = [
    endereco.rua,
    endereco.numero,
    endereco.bairro,
    endereco.cidade,
    endereco.estado,
    'BR'
  ].filter(Boolean).join(', ');
  const consultaCidadeEstado = [endereco.cidade, endereco.estado, 'BR'].filter(Boolean).join(',');

  if (consultaCompleta) {
    consultas.push(consultaCompleta);
  }

  if (consultaCidadeEstado && consultaCidadeEstado !== consultaCompleta) {
    consultas.push(consultaCidadeEstado);
  }

  return consultas;
};

const selecionarMelhorResultadoGeo = (resultados = [], endereco = {}) => {
  if (!Array.isArray(resultados) || resultados.length === 0) {
    return null;
  }

  const estadoEsperado = endereco.estado?.toUpperCase();
  const cidadeEsperada = endereco.cidade?.toLowerCase();

  return resultados.find((item) => {
    const nome = item.name?.toLowerCase();
    const admin1 = item.admin1?.toUpperCase();
    return (!cidadeEsperada || nome === cidadeEsperada) && (!estadoEsperado || admin1 === estadoEsperado);
  }) || resultados[0];
};

const buscarCoordenadasPorEndereco = async (endereco = {}) => {
  const consultas = montarConsultasEndereco(endereco);
  if (consultas.length === 0) {
    return null;
  }

  for (const consulta of consultas) {
    const response = await axios.get(obterGeoUrl(), {
      params: {
        name: consulta,
        count: 5,
        language: 'pt',
        format: 'json'
      }
    });

    const resultado = selecionarMelhorResultadoGeo(response.data?.results, endereco);
    if (resultado) {
      return {
        latitude: resultado.lat,
        longitude: resultado.lon,
        localidade: [resultado.name, resultado.admin1].filter(Boolean).join(' - ')
      };
    }
  }

  return null;
};

const buscarCoordenadasDoUsuario = async (usuario = {}) => {
  const endereco = await enriquecerEnderecoComCEP(usuario.endereco || {});

  if (endereco?.cidade && endereco?.estado) {
    try {
      return await buscarCoordenadasPorEndereco(endereco);
    } catch (erro) {
      console.error('Erro ao buscar coordenadas por endereco:', erro.message);
    }
  }

  return null;
};

const selecionarItemMaisProximo = (lista = [], dataHoraConsulta) => {
  const alvo = dataHoraConsulta.getTime();
  const inicioJanela = alvo - (90 * 60 * 1000);
  const fimJanela = alvo + (90 * 60 * 1000);

  const candidatosNoHorario = lista.filter((item) => {
    const previsaoEm = new Date(item.dt * 1000).getTime();
    return previsaoEm >= inicioJanela && previsaoEm <= fimJanela;
  });

  const candidatos = candidatosNoHorario.length > 0 ? candidatosNoHorario : lista;

  return candidatos.reduce((melhor, atual) => {
    if (!melhor) {
      return atual;
    }

    const diffMelhor = Math.abs((melhor.dt * 1000) - alvo);
    const diffAtual = Math.abs((atual.dt * 1000) - alvo);
    return diffAtual < diffMelhor ? atual : melhor;
  }, null);
};

const traduzirWeatherCode = (codigo) => WEATHER_CODE_MAP[codigo] || 'Condicao meteorologica indisponivel';
const preverChuvaPorCodigo = (codigo, precipitacao = 0) => precipitacao >= 40 || [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(codigo);

const obterIndiceMaisProximo = (horarios = [], dataHoraConsulta) => {
  if (!Array.isArray(horarios) || horarios.length === 0) {
    return -1;
  }

  const alvo = dataHoraConsulta.getTime();
  const inicioJanela = alvo - (90 * 60 * 1000);
  const fimJanela = alvo + (90 * 60 * 1000);

  let melhorIndice = -1;
  let melhorDiff = Number.POSITIVE_INFINITY;

  horarios.forEach((horario, indice) => {
    const instante = new Date(horario).getTime();
    if (Number.isNaN(instante)) {
      return;
    }

    const dentroJanela = instante >= inicioJanela && instante <= fimJanela;
    const diff = Math.abs(instante - alvo);

    if (dentroJanela && diff < melhorDiff) {
      melhorIndice = indice;
      melhorDiff = diff;
      return;
    }

    if (melhorIndice === -1 && diff < melhorDiff) {
      melhorIndice = indice;
      melhorDiff = diff;
    }
  });

  return melhorIndice;
};


const buscarClima = async (latitude, longitude, dataConsulta, horario, localidade) => {
  const dataHoraConsulta = parseDataHoraConsulta(dataConsulta, horario);
  if (!dataHoraConsulta) {
    return criarClimaIndisponivel('Data ou horario da consulta invalido.');
  }

  const agora = new Date();
  const diferencaDias = (dataHoraConsulta.getTime() - agora.getTime()) / (24 * 60 * 60 * 1000);

  if (diferencaDias < 0) {
    return criarClimaIndisponivel('Nao e possivel consultar previsao para datas passadas.');
  }

  if (diferencaDias > FORECAST_WINDOW_DAYS) {
    return criarClimaIndisponivel('A previsao detalhada esta disponivel apenas para os proximos 5 dias.');
  }

  try {
    const response = await axios.get(obterForecastUrl(), {
      params: {
        latitude,
        longitude,
        hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,weather_code',
        forecast_days: FORECAST_WINDOW_DAYS,
        timezone: 'America/Sao_Paulo'
      }
    });

    const horarios = response.data?.hourly?.time;
    const indice = obterIndiceMaisProximo(horarios, dataHoraConsulta);

    if (indice === -1) {
      return criarClimaIndisponivel('Nao foi encontrada previsao para o horario solicitado.');
    }

    const temperatura = response.data?.hourly?.temperature_2m?.[indice];
    const umidade = response.data?.hourly?.relative_humidity_2m?.[indice];
    const precipitacao = response.data?.hourly?.precipitation_probability?.[indice] || 0;
    const weatherCode = response.data?.hourly?.weather_code?.[indice];

    return {
      disponivel: true,
      descricao: traduzirWeatherCode(weatherCode),
      temperatura,
      umidade,
      previsaoChuva: preverChuvaPorCodigo(weatherCode, precipitacao),
      probabilidadeChuva: precipitacao,
      icone: null,
      dataPrevisao: new Date(horarios[indice]),
      localidade
    };
  } catch (erro) {
    console.error('Erro ao buscar clima:', erro.message);
    return criarClimaIndisponivel('Nao foi possivel consultar a previsao do tempo no momento.');
  }
};


const buscarCEP = async (cep) => {
  try {
    const response = await axios.get(`${process.env.CEP_API_URL}/${cep}/json/`);
    
    if (response.data.erro) {
      return null;
    }

    return response.data;
  } catch (erro) {
    console.error('Erro ao buscar CEP:', erro.message);
    return null;
  }
};

const enriquecerEnderecoComCEP = async (endereco = {}) => {
  if (!endereco?.cep) {
    return endereco;
  }

  const dadosCep = await buscarCEP(endereco.cep);
  if (!dadosCep) {
    return endereco;
  }

  return {
    ...endereco,
    rua: endereco.rua || dadosCep.logradouro,
    bairro: endereco.bairro || dadosCep.bairro,
    cidade: endereco.cidade || dadosCep.localidade,
    estado: endereco.estado || dadosCep.uf,
    cep: dadosCep.cep || endereco.cep
  };
};


const agendar = async (req, res) => {
  try {
    const { dataConsulta, horario, medico, especialidade, motivo } = req.body;

    if (!dataConsulta || !horario || !medico || !especialidade) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

  
    const conflito = await Agendamento.findOne({
      dataConsulta: new Date(dataConsulta),
      horario,
      medico,
      status: { $ne: 'cancelado' }
    });

    if (conflito) {
      return res.status(400).json({ erro: 'Horário indisponível' });
    }

    
    const usuario = await Usuario.findById(req.usuarioId);
    let climaPrevisao = criarClimaIndisponivel('Previsao nao consultada.');

    if (usuario?.endereco?.cep || (usuario?.endereco?.cidade && usuario?.endereco?.estado)) {
      const coordenadas = await buscarCoordenadasDoUsuario(usuario);

      if (coordenadas) {
        climaPrevisao = await buscarClima(
          coordenadas.latitude,
          coordenadas.longitude,
          dataConsulta,
          horario,
          coordenadas.localidade
        );
      } else {
        climaPrevisao = criarClimaIndisponivel('Nao foi possivel determinar a localizacao do paciente para consultar o clima.');
      }
    } else {
      climaPrevisao = criarClimaIndisponivel('Cadastre um endereco com CEP ou com cidade e estado para habilitar a previsao do tempo.');
    }

    const novoAgendamento = new Agendamento({
      paciente: req.usuarioId,
      dataConsulta: new Date(dataConsulta),
      horario,
      medico,
      especialidade,
      motivo,
      previsaoClima: climaPrevisao
    });

    await novoAgendamento.save();

    res.status(201).json({
      mensagem: 'Consulta agendada com sucesso',
      agendamento: novoAgendamento
    });
  } catch (erro) {
    console.error('Erro ao agendar:', erro);
    res.status(500).json({ erro: 'Erro ao agendar consulta' });
  }
};


const listarMeusAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find({ paciente: req.usuarioId })
      .populate('paciente', 'nome email telefone')
      .sort({ dataConsulta: 1 });

    res.json(agendamentos);
  } catch (erro) {
    console.error('Erro ao listar agendamentos:', erro);
    res.status(500).json({ erro: 'Erro ao listar agendamentos' });
  }
};


const listarTodos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find()
      .populate('paciente', 'nome email telefone')
      .sort({ dataConsulta: 1 });

    res.json(agendamentos);
  } catch (erro) {
    console.error('Erro ao listar agendamentos:', erro);
    res.status(500).json({ erro: 'Erro ao listar agendamentos' });
  }
};


const atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['agendado', 'confirmado', 'cancelado', 'realizado'].includes(status)) {
      return res.status(400).json({ erro: 'Status inválido' });
    }

    const agendamento = await Agendamento.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('paciente', 'nome email');

    if (!agendamento) {
      return res.status(404).json({ erro: 'Agendamento não encontrado' });
    }

    res.json({
      mensagem: 'Status atualizado com sucesso',
      agendamento
    });
  } catch (erro) {
    console.error('Erro ao atualizar status:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar status' });
  }
};


const cancelar = async (req, res) => {
  try {
    const { id } = req.params;

    const agendamento = await Agendamento.findById(id);

    if (!agendamento) {
      return res.status(404).json({ erro: 'Agendamento não encontrado' });
    }

    
    if (agendamento.paciente.toString() !== req.usuarioId && req.usuarioTipo !== 'admin') {
      return res.status(403).json({ erro: 'Sem permissão para cancelar' });
    }

    agendamento.status = 'cancelado';
    await agendamento.save();

    res.json({
      mensagem: 'Agendamento cancelado',
      agendamento
    });
  } catch (erro) {
    console.error('Erro ao cancelar:', erro);
    res.status(500).json({ erro: 'Erro ao cancelar agendamento' });
  }
};

module.exports = {
  agendar,
  listarMeusAgendamentos,
  listarTodos,
  atualizarStatus,
  cancelar,
  buscarClima
};
