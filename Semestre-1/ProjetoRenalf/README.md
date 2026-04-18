# Árvore Binária de Busca (BST) - Renalf S/A

Implementação de uma Árvore Binária de Busca em C com operações básicas de inserção, remoção e travessias.

## 📋 Descrição

Este projeto implementa uma estrutura de dados de **Árvore Binária de Busca (BST)** que permite:
- Inserir novos nós
- Remover nós existentes
- Realizar travessias (pré-ordem, em ordem e pós-ordem)

## 🎯 Funcionalidades

### Operações Principais

1. **Inserir nó** - Adiciona um novo valor à árvore respeitando as regras da BST
2. **Remover nó** - Remove um valor existente (com tratamento de 3 casos)
3. **Busca Pré-Ordem** - Percurso: Raiz → Esquerda → Direita
4. **Busca Em Ordem** - Percurso: Esquerda → Raiz → Direita (retorna valores ordenados)
5. **Busca Pós-Ordem** - Percurso: Esquerda → Direita → Raiz

## 💻 Como Usar

### Compilar
```bash
gcc -o arvore arvore.c
```

### Executar
```bash
./arvore
```

### Menu Interativo
```
* * * MENU DE OPCOES - RENALF S/A * * *
1. Incluir nó
2. Remover nó
3. Buscar pré-ordem
4. Busca em ordem
5. Buscar pós-ordem
0. Encerrar
```

##  Estrutura do Código

### Estrutura de Dados
```c
typedef struct No {
    int valor;
    struct No *esquerda;
    struct No *direita;
} No;
```

### Funções Implementadas

- `No* criarNo(int valor)` - Cria um novo nó
- `No* encontrarMenor(No* raiz)` - Encontra o nó com menor valor
- `No* inserir(No* raiz, int valor)` - Insere um valor na árvore
- `No* remover(No* raiz, int valor)` - Remove um valor da árvore
- `void preOrdem(No* raiz)` - Travessia pré-ordem
- `void emOrdem(No* raiz)` - Travessia em ordem
- `void posOrdem(No* raiz)` - Travessia pós-ordem

## 📚 Conceitos de BST

Uma Árvore Binária de Busca segue a regra fundamental:
- Valores **menores** ficam na subárvore **esquerda**
- Valores **maiores** ficam na subárvore **direita**
- Não permite **valores duplicados**

## 🔧 Requisitos

- Compilador C (gcc, clang, etc.)
- Sistema operacional: Windows, Linux ou macOS

## 📝 Notas

- O programa valida valores duplicados
- Trata adequadamente remoção de nós com 0, 1 ou 2 filhos
- Aloca memória dinamicamente com `malloc`
- Interface amigável em menu interativo

## 👤 Autor

Projeto desenvolvido para fins educacionais - Renalf S/A
