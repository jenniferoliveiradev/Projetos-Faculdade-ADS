package br.com.uva.trabalho.app;

import br.com.uva.trabalho.model.Aviao;
import br.com.uva.trabalho.model.Navio;
import br.com.uva.trabalho.util.Leitura;

public class Main {
    public static void main(String[] args) {

        // Criar vetores de 10 objetos cada
        Aviao[] avioes = new Aviao[10];
        Navio[] navios = new Navio[10];

        System.out.println("=== CADASTRO DE AVIÕES ===");
        for (int i = 0; i < avioes.length; i++) {
            System.out.println("\nCadastro do avião " + (i + 1));
            avioes[i] = new Aviao();
            avioes[i].entrada();
        }

        System.out.println("\n=== CADASTRO DE NAVIOS ===");
        for (int i = 0; i < navios.length; i++) {
            System.out.println("\nCadastro do navio " + (i + 1));
            navios[i] = new Navio();
            navios[i].entrada();
        }

        // Imprimir todos os aviões
        System.out.println("\n=== LISTA DE AVIÕES ===");
        for (int i = 0; i < avioes.length; i++) {
            System.out.println("\nAvião " + (i + 1));
            avioes[i].imprimir();
        }

        // Imprimir todos os navios
        System.out.println("\n=== LISTA DE NAVIOS ===");
        for (int i = 0; i < navios.length; i++) {
            System.out.println("\nNavio " + (i + 1));
            navios[i].imprimir();
        }

        // Exemplo opcional: reajustar preço do primeiro avião
        double percentual = Leitura.lerDouble("\nDigite o percentual de reajuste para o primeiro avião: ");
        avioes[0].reajustarPreco(percentual);
        System.out.println("Preço reajustado do primeiro avião: " + avioes[0].getPreco());
    }
}
