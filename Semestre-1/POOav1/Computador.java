public class Computador {
    // Atributos
    private String marca;
    private String modelo;
    private String processador;
    private int ram; // em GB
    private int armazenamento; // em GB

    // Construtor default (sem parametros)
    public Computador () {
        this.marca = "";
        this.modelo = "";
        this.processador = "";
        this.ram = 0;
        this.armazenamento = 0;
    }

    // Construtor com cinco parametros
    public Computador (String marca, String modelo, String processador, int ram, int armazenamento) {
        this.marca = marca;
        this.modelo = modelo;
        this.processador = processador;
        this.ram = ram;
        this.armazenamento = armazenamento;
    }

    //Getters e Setters
    public String getMarca() {
        return marca;
    }
    public void setMarca(String marca) {
        this.marca = marca;
    }
    public String getModelo() {
        return modelo;
    }
    public void setModelo(String modelo) {
        this.modelo = modelo;
    }
    public String getProcessador() {
        return processador;
    }
    public void setProcessador(String processador) {
        this.processador = processador;
    }
    public int getRam() {
        return ram;
    }
    public void setRam(int ram) {
        this.ram = ram;
    }
    public int getArmazenamento() {
        return armazenamento;
    }
    public void setArmazenamento(int armazenamento) {
        this.armazenamento = armazenamento;
    }
    //Metodo para imprimir todos os atributos
    public void imprimir() {
        System.out.println("Marca: " + this.marca);
        System.out.println("Modelo: " + this.modelo);
        System.out.println("Processador: " + this.processador);
        System.out.println("RAM: " + this.ram);
        System.out.println("Armazenamento: " + this.armazenamento);
        System.out.println("--------------");
    }

}
