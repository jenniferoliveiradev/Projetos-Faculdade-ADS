#include <stdio.h>
#include <stdlib.h>

/*
 * Estrutura do Nó da Árvore
 * Contém o valor inteiro e ponteiros para a esquerda e direita.
 */
typedef struct No {
    int valor;
    struct No *esquerda;
    struct No *direita;
} No;

// --- Funções Auxiliares ---

/* Função para criar um novo nó em memória */
No* criarNo(int valor) {
    No *novo = (No*)malloc(sizeof(No));
    if (novo) {
        novo->valor = valor;
        novo->esquerda = NULL;
        novo->direita = NULL;
    } else {
        printf("\nErro ao alocar memoria!\n");
    }
    return novo;
}

/* Função para encontrar o nó com o menor valor (usado na remoção) */
No* encontrarMenor(No* raiz) {
    No* atual = raiz;
    // O menor valor em uma BST é sempre o nó mais à esquerda
    while (atual && atual->esquerda != NULL) {
        atual = atual->esquerda;
    }
    return atual;
}

// --- Operações Principais ---

/* 1. Incluir nó (Inserção) */
No* inserir(No* raiz, int valor) {
    // Se a árvore estiver vazia, cria o nó raiz
    if (raiz == NULL) {
        return criarNo(valor);
    }

    // Regra da BST: Menor para esquerda, Maior para direita
    if (valor < raiz->valor) {
        raiz->esquerda = inserir(raiz->esquerda, valor);
    } else if (valor > raiz->valor) {
        raiz->direita = inserir(raiz->direita, valor);
    } else {
        printf("\nValor %d ja existe na arvore!\n", valor);
    }

    return raiz;
}

/* 2. Remover nó (Remoção) */
No* remover(No* raiz, int valor) {
    if (raiz == NULL) {
        printf("\nValor nao encontrado!\n");
        return NULL;
    }

    // Procura o nó a ser removido
    if (valor < raiz->valor) {
        raiz->esquerda = remover(raiz->esquerda, valor);
    } else if (valor > raiz->valor) {
        raiz->direita = remover(raiz->direita, valor);
    } else {
        // Encontrou o nó a ser removido

        // Caso 1: Nó folha ou com apenas um filho
        if (raiz->esquerda == NULL) {
            No *temp = raiz->direita;
            free(raiz);
            return temp;
        } else if (raiz->direita == NULL) {
            No *temp = raiz->esquerda;
            free(raiz);
            return temp;
        }

        // Caso 2: Nó com dois filhos
        // Pega o sucessor (menor valor da subárvore direita)
        No* temp = encontrarMenor(raiz->direita);

        // Copia o valor do sucessor para este nó
        raiz->valor = temp->valor;

        // Remove o sucessor duplicado da subárvore direita
        raiz->direita = remover(raiz->direita, temp->valor);
    }
    return raiz;
}

/* 3. Buscar Pré-Ordem (Raiz -> Esquerda -> Direita) */
void preOrdem(No* raiz) {
    if (raiz != NULL) {
        printf("%d ", raiz->valor);
        preOrdem(raiz->esquerda);
        preOrdem(raiz->direita);
    }
}

/* 4. Buscar Em Ordem (Esquerda -> Raiz -> Direita) */
void emOrdem(No* raiz) {
    if (raiz != NULL) {
        emOrdem(raiz->esquerda);
        printf("%d ", raiz->valor);
        emOrdem(raiz->direita);
    }
}

/* 5. Buscar Pós-Ordem (Esquerda -> Direita -> Raiz) */
void posOrdem(No* raiz) {
    if (raiz != NULL) {
        posOrdem(raiz->esquerda);
        posOrdem(raiz->direita);
        printf("%d ", raiz->valor);
    }
}

// --- Interface ---

void exibirMenu() {
    printf("\n\n* * * MENU DE OPCOES - RENALF S/A * * *\n");
    printf("1. Incluir no\n");
    printf("2. Remover no\n");
    printf("3. Buscar pre-ordem\n");
    printf("4. Buscar em ordem\n");
    printf("5. Buscar pos-ordem\n");
    printf("0. Encerrar\n");
    printf("Escolha uma opcao: ");
}

int main() {
    No *raiz = NULL;
    int opcao, valor;

    do {
        exibirMenu();
        scanf("%d", &opcao);

        switch(opcao) {
            case 1:
                printf("\nDigite o valor a ser incluido: ");
                scanf("%d", &valor);
                raiz = inserir(raiz, valor);
                printf("Valor %d inserido com sucesso.\n", valor);
                break;
            case 2:
                printf("\nDigite o valor a ser removido: ");
                scanf("%d", &valor);
                raiz = remover(raiz, valor);
                break;
            case 3:
                printf("\n--- Busca Pre-Ordem ---\n");
                preOrdem(raiz);
                printf("\n");
                break;
            case 4:
                printf("\n--- Busca Em Ordem ---\n");
                emOrdem(raiz);
                printf("\n");
                break;
            case 5:
                printf("\n--- Busca Pos-Ordem ---\n");
                posOrdem(raiz);
                printf("\n");
                break;
            case 0:
                printf("\nEncerrando o sistema...\n");
                break;
            default:
                printf("\nOpcao invalida!\n");
        }
    } while (opcao != 0);

    return 0;
}