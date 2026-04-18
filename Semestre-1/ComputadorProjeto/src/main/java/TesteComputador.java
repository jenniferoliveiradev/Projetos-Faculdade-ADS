import java.util.Scanner;
public class TesteComputador {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Criando dois objetos com construtor default
        Computador comp1 = new Computador();
        Computador comp2 = new Computador();

        // Preenchendo comp1 com setters
        System.out.println("Preencha os dados para o Computador 1 (usando setters):");
        System.out.print("Marca: ");
        comp1.setMarca(scanner.nextLine());
        System.out.print("Modelo: ");
        comp1.setModelo(scanner.nextLine());
        System.out.print("Processador: ");
        comp1.setProcessador(scanner.nextLine());
        System.out.print("RAM (em GB): ");
        try {
            comp1.setRam(scanner.nextInt());
        } catch (Exception e) {
            System.out.println("Erro: Digite um número inteiro para RAM.");
            scanner.nextLine(); // Limpar buffer
            return; // Encerra para evitar erros subsequentes
        }
        System.out.print("Armazenamento (em GB): ");
        try {
            comp1.setArmazenamento(scanner.nextInt());
        } catch (Exception e) {
            System.out.println("Erro: Digite um número inteiro para Armazenamento.");
            scanner.nextLine(); // Limpar buffer
            return;
        }
        scanner.nextLine(); // Limpar buffer

        // Preenchendo comp2 com setters
        System.out.println("\nPreencha os dados para o Computador 2 (usando setters):");
        System.out.print("Marca: ");
        comp2.setMarca(scanner.nextLine());
        System.out.print("Modelo: ");
        comp2.setModelo(scanner.nextLine());
        System.out.print("Processador: ");
        comp2.setProcessador(scanner.nextLine());
        System.out.print("RAM (em GB): ");
        try {
            comp2.setRam(scanner.nextInt());
        } catch (Exception e) {
            System.out.println("Erro: Digite um número inteiro para RAM.");
            scanner.nextLine(); // Limpar buffer
            return;
        }
        System.out.print("Armazenamento (em GB): ");
        try {
            comp2.setArmazenamento(scanner.nextInt());
        } catch (Exception e) {
            System.out.println("Erro: Digite um número inteiro para Armazenamento.");
            scanner.nextLine(); // Limpar buffer
            return;
        }
        scanner.nextLine(); // Limpar buffer

        // Criando dois objetos com construtor parametrizado
        System.out.println("\nPreencha os dados para o Computador 3 (usando construtor parametrizado):");
        System.out.print("Marca: ");
        String marca3 = scanner.nextLine();
        System.out.print("Modelo: ");
        String modelo3 = scanner.nextLine();
        System.out.print("Processador: ");
        String processador3 = scanner.nextLine();
        System.out.print("RAM (em GB): ");
        int ram3;
        try {
            ram3 = scanner.nextInt();
        } catch (Exception e) {
            System.out.println("Erro: Digite um número inteiro para RAM.");
            scanner.nextLine(); // Limpar buffer
            return;
        }
        System.out.print("Armazenamento (em GB): ");
        int armazenamento3;
        try {
            armazenamento3 = scanner.nextInt();
        } catch (Exception e) {
            System.out.println("Erro: Digite um número inteiro para Armazenamento.");
            scanner.nextLine(); // Limpar buffer
            return;
        }
        scanner.nextLine(); // Limpar buffer
        Computador comp3 = new Computador(marca3, modelo3, processador3, ram3, armazenamento3);

        System.out.println("\nPreencha os dados para o Computador 4 (usando construtor parametrizado):");
        System.out.print("Marca: ");
        String marca4 = scanner.nextLine();
        System.out.print("Modelo: ");
        String modelo4 = scanner.nextLine();
        System.out.print("Processador: ");
        String processador4 = scanner.nextLine();
        System.out.print("RAM (em GB): ");
        int ram4;
        try {
            ram4 = scanner.nextInt();
        } catch (Exception e) {
            System.out.println("Erro: Digite um número inteiro para RAM.");
            scanner.nextLine(); // Limpar buffer
            return;
        }
        System.out.print("Armazenamento (em GB): ");
        int armazenamento4;
        try {
            armazenamento4 = scanner.nextInt();
        } catch (Exception e) {
            System.out.println("Erro: Digite um número inteiro para Armazenamento.");
            scanner.nextLine(); // Limpar buffer
            return;
        }
        scanner.nextLine(); // Limpar buffer
        Computador comp4 = new Computador(marca4, modelo4, processador4, ram4, armazenamento4);

        // Exibindo todos os objetos
        System.out.println("\nExibindo todos os computadores:");
        comp1.imprimir();
        comp2.imprimir();
        comp3.imprimir();
        comp4.imprimir();

        scanner.close();
    }
}