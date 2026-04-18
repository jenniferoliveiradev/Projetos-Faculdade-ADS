package br.com.uva.trabalho.model;

import br.com.uva.trabalho.util.Leitura;

public class Aviao extends Transporte {
    private String prefixo;
    private String dataRevisao;

    // Construtor vazio
    public Aviao() {
        super();
        this.prefixo = "";
        this.dataRevisao = "";
    }

    // Construtor com parâmetros
    public Aviao(int capacidadeTanque, int numeroPassageiros, double preco, String prefixo, String dataRevisao) {
        super(capacidadeTanque, numeroPassageiros, preco);
        this.prefixo = prefixo;
        this.dataRevisao = dataRevisao;
    }

    // Getters e Setters
    public String getPrefixo() { return prefixo; }
    public void setPrefixo(String prefixo) { this.prefixo = prefixo; }

    public String getDataRevisao() { return dataRevisao; }
    public void setDataRevisao(String dataRevisao) { this.dataRevisao = dataRevisao; }

    // Reajustar preço
    public void reajustarPreco(double percentual) {
        this.preco += this.preco * (percentual / 100);
    }

    @Override
    public void imprimir() {
        super.imprimir();
        System.out.println("Prefixo: " + prefixo);
        System.out.println("Data da revisão: " + dataRevisao);
    }

    @Override
    public void entrada() {
        super.entrada();
        prefixo = Leitura.lerString("Digite o prefixo do avião: ");
        dataRevisao = Leitura.lerString("Digite a data da revisão: ");
    }
}
