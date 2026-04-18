package br.com.uva.trabalho.model;

import br.com.uva.trabalho.util.Leitura;

public class Navio extends Transporte {
    private String nome;
    private int numeroTripulantes;
    private String dataLancamento;

    // Construtor vazio
    public Navio() {
        super();
        this.nome = "";
        this.numeroTripulantes = 0;
        this.dataLancamento = "";
    }

    // Construtor com parâmetros
    public Navio(int capacidadeTanque, int numeroPassageiros, double preco,
                 String nome, int numeroTripulantes, String dataLancamento) {
        super(capacidadeTanque, numeroPassageiros, preco);
        this.nome = nome;
        this.numeroTripulantes = numeroTripulantes;
        this.dataLancamento = dataLancamento;
    }

    // Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public int getNumeroTripulantes() { return numeroTripulantes; }
    public void setNumeroTripulantes(int numeroTripulantes) { this.numeroTripulantes = numeroTripulantes; }

    public String getDataLancamento() { return dataLancamento; }
    public void setDataLancamento(String dataLancamento) { this.dataLancamento = dataLancamento; }

    // Método específico
    public double passageirosPorTripulantes() {
        if (numeroTripulantes == 0) return 0;
        return (double) numeroPassageiros / numeroTripulantes;
    }

    @Override
    public void imprimir() {
        super.imprimir();
        System.out.println("Nome do navio: " + nome);
        System.out.println("Número de tripulantes: " + numeroTripulantes);
        System.out.println("Data de lançamento: " + dataLancamento);
        System.out.println("Passageiros por tripulante: " + passageirosPorTripulantes());
    }

    @Override
    public void entrada() {
        super.entrada();
        nome = Leitura.lerString("Digite o nome do navio: ");
        numeroTripulantes = Leitura.lerInt("Digite o número de tripulantes: ");
        dataLancamento = Leitura.lerString("Digite a data de lançamento: ");
    }
}
