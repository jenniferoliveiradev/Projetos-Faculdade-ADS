package br.com.uva.trabalho;
import java.util.InputMismatchException;
import java.util.Scanner;

public class Transporte {
    protected int capacidadeTanque;
    protected int numeroPassageiros;
    protected double preco;

    // Construtor vazio
    public void Transporte() {
        this.capacidadeTanque = 0;
        this.numeroPassageiros = 0;
        this.preco = 0;
    }

    // Construtor com parâmetros
    public void Transporte(int capacidadeTanque, int numeroPassageiros, double preco) {
        this.capacidadeTanque = capacidadeTanque;
        this.numeroPassageiros = numeroPassageiros;
        this.preco = preco;
    }

    // Getters e Setters
    public int getCapacidadeTanque() {
        return capacidadeTanque;
    }

    public void setCapacidadeTanque() {
        this.capacidadeTanque = this.capacidadeTanque;
    }

    public int getNumeroPassageiros() {
        return numeroPassageiros;
    }

    public void setNumeroPassageiros(int numeroPassageiros) {
        this.numeroPassageiros = numeroPassageiros;
    }
    public double getPreco() {
        return preco;
    }

    public void setPreco(double preco) {
        this.preco = preco;
    }

    // Metodo para imprimir dados
    public void imprimir() {
        System.out.println("capacidade do tanque: " + capacidadeTanque);
        System.out.println("numero de passageiros: " + numeroPassageiros);
        System.out.println("Preco: " + preco);
    }

    // metodo de entrada com tratamento de exceçoes
    public void entrada() {
        Scanner sc = new Scanner(System.in);
        try {
            System.out.print("Digite a capacidade do tanque: ");
            capacidadeTanque = sc.nextInt();

            System.out.print("Digite a numero de passageiros: ");
            numeroPassageiros = sc.nextInt();

            System.out.print("Digite o preço: ");
            preco = sc.nextDouble();
        }
        catch (InputMismatchException e) {
            System.out.println("Entrada inválida! Por favor, digite os valores corretamente.");
            sc.nextLine(); //limpa buffer
        }
    }
}



