package br.com.uva.trabalho.util;

import java.util.InputMismatchException;
import java.util.Scanner;

public class Leitura {

    private static Scanner sc = new Scanner(System.in);

    public static int lerInt(String mensagem) {
        int valor = 0;
        boolean valido = false;
        while (!valido) {
            try {
                System.out.print(mensagem);
                valor = sc.nextInt();
                sc.nextLine(); // limpa buffer
                valido = true;
            } catch (InputMismatchException e) {
                System.out.println("Entrada inválida! Digite um número inteiro.");
                sc.nextLine(); // limpa buffer
            }
        }
        return valor;
    }

    public static double lerDouble(String mensagem) {
        double valor = 0;
        boolean valido = false;
        while (!valido) {
            try {
                System.out.print(mensagem);
                valor = sc.nextDouble();
                sc.nextLine(); // limpa buffer
                valido = true;
            } catch (InputMismatchException e) {
                System.out.println("Entrada inválida! Digite um número decimal.");
                sc.nextLine(); // limpa buffer
            }
        }
        return valor;
    }

    public static String lerString(String mensagem) {
        System.out.print(mensagem);
        return sc.nextLine();
    }
}

