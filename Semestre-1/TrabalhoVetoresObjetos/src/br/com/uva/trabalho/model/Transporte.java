package br.com.uva.trabalho.model;

import br.com.uva.trabalho.util.Leitura;

public class Transporte {
    protected int capacidadeTanque;
    protected int numeroPassageiros;
    protected double preco;

    // Construtor vazio
    public Transporte() {
        this.capacidadeTanque = 0;
        this.numeroPassageiros = 0;
        this.preco = 0.0;
    }

    // Construtor com parâmetros
    public Transporte(int capacidadeTanque, int numeroPassageiros, double preco) {
        this.capacidadeTanque = capacidadeTanque;
        this.numeroPassageiros = numeroPassageiros;
        this.preco = preco;
    }

    // Getters e Setters
    public int getCapacidadeTanque() { return capacidadeTanque; }
    public void setCapacidadeTanque(int capacidadeTanque) { this.capacidadeTanque = capacidadeTanque; }

    public int getNumeroPassageiros() { return numeroPassageiros; }
    public void setNumeroPassageiros(int numeroPassageiros) { this.numeroPassageiros = numeroPassageiros; }

    public double getPreco() { return preco; }
    public void setPreco(double preco) { this.preco = preco; }

    // Método para imprimir dados
    public void imprimir() {
        System.out.println("Capacidade do tanque: " + capacidadeTanque);
        System.out.println("Número de passageiros: " + numeroPassageiros);
        System.out.println("Preço: " + preco);
    }

    // Método de entrada usando classe Leitura
    public void entrada() {
        capacidadeTanque = Leitura.lerInt("Digite a capacidade do tanque: ");
        numeroPassageiros = Leitura.lerInt("Digite o número de passageiros: ");
        preco = Leitura.lerDouble("Digite o preço: ");
    }
}

