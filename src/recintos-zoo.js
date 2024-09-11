class Recinto {
    constructor(numero, bioma, tamanhoTotal, animaisPresentes = new Map()) {
        this.numero = numero;
        this.bioma = bioma;
        this.tamanhoTotal = tamanhoTotal;
        this.animaisPresentes = animaisPresentes;
    }
}

class RecintosZoo {
    constructor() {
        this.tamanhosAnimais = {
            LEAO: 3,
            LEOPARDO: 2,
            CROCODILO: 3,
            MACACO: 1,
            GAZELA: 2,
            HIPOPOTAMO: 4
        };

        this.biomasAnimais = {
            savana: ['LEAO', 'LEOPARDO', 'MACACO', 'GAZELA', 'HIPOPOTAMO'],
            rio: ['CROCODILO', 'HIPOPOTAMO'],
            floresta: ['MACACO'],
            'savana e rio': ['LEAO', 'LEOPARDO', 'MACACO', 'GAZELA', 'HIPOPOTAMO', 'CROCODILO']
        };

        this.recintos = [
            new Recinto(1, 'savana', 10, new Map([['MACACO', 3]])),
            new Recinto(2, 'floresta', 5, new Map()),
            new Recinto(3, 'savana e rio', 7, new Map([['GAZELA', 1]])),
            new Recinto(4, 'rio', 8, new Map()),
            new Recinto(5, 'savana', 9, new Map([['LEAO', 1]]))
        ];
    }

    getRecintos() {
        return this.recintos;
    }

    listarRecintosViaveis(animal, quantidade) {
        return this.recintos.filter(recinto => {
            const motivo = this.podeAlocarAnimalComMotivo(recinto, animal, quantidade);
            return motivo === 'ok';
        });
    }

    adicionarAnimal(numeroRecinto, animal, quantidade) {
        const recinto = this.getRecintoPorNumero(numeroRecinto);
        if (!recinto) {
            return 'Recinto inválido.';
        }

        const tamanhoAnimal = this.tamanhosAnimais[animal];
        if (!tamanhoAnimal) {
            return 'Animal não reconhecido.';
        }

        const motivo = this.podeAlocarAnimalComMotivo(recinto, animal, quantidade);
        if (motivo !== 'ok') {
            return motivo;
        }

        const espacoOcupado = this.calcularEspacoOcupado(recinto);
        const espacoLivre = recinto.tamanhoTotal - espacoOcupado;
        const espacoAnimal = tamanhoAnimal * quantidade;

        if (espacoLivre < espacoAnimal) {
            return 'Espaço insuficiente no recinto.';
        }

        recinto.animaisPresentes.set(animal, (recinto.animaisPresentes.get(animal) || 0) + quantidade);
        return 'Animal colocado no recinto com sucesso.';
    }

    listarAnimaisNoRecinto(numeroRecinto) {
        const recinto = this.getRecintoPorNumero(numeroRecinto);
        if (!recinto) {
            console.log('Recinto inválido.');
            return;
        }

        if (recinto.animaisPresentes.size === 0) {
            console.log('Nenhum animal no recinto.');
        } else {
            console.log('Animais no recinto:');
            recinto.animaisPresentes.forEach((quantidade, animal) => {
                console.log(`${animal}: ${quantidade}`);
            });
        }
    }

    retirarAnimal(numeroRecinto, animal, quantidade) {
        const recinto = this.getRecintoPorNumero(numeroRecinto);
        if (!recinto) {
            return false;
        }

        if (!recinto.animaisPresentes.has(animal)) {
            return false;
        }

        const quantidadeAtual = recinto.animaisPresentes.get(animal);
        if (quantidadeAtual < quantidade) {
            return false;
        }

        recinto.animaisPresentes.set(animal, quantidadeAtual - quantidade);
        if (recinto.animaisPresentes.get(animal) === 0) {
            recinto.animaisPresentes.delete(animal);
        }

        return true;
    }

    getRecintoPorNumero(numeroRecinto) {
        return this.recintos.find(recinto => recinto.numero === numeroRecinto);
    }

    podeAlocarAnimalComMotivo(recinto, animal, quantidade) {
        const tamanhoAnimal = this.tamanhosAnimais[animal];
        if (!tamanhoAnimal) {
            return 'Animal não reconhecido.';
        }
    
        const biomasPermitidos = this.biomasAnimais[recinto.bioma];
        if (!biomasPermitidos || !biomasPermitidos.includes(animal)) {
            return 'Este animal não pode viver no bioma deste recinto.';
        }
    
        const espacoOcupado = this.calcularEspacoOcupado(recinto);
        const espacoLivre = recinto.tamanhoTotal - espacoOcupado;
        if (espacoLivre < tamanhoAnimal * quantidade) {
            return 'Espaço insuficiente no recinto.';
        }
    
        if (animal === 'MACACO') {
            if (quantidade >= 2 && recinto.animaisPresentes.size === 0) {
                return 'ok';
            }
            if (quantidade < 2 && recinto.animaisPresentes.size === 0) {
                return 'Macaco não pode ser colocado sozinho no recinto. Insira outro macaco ou outro animal primeiro.';
            }
        }
    
        if (['LEAO', 'LEOPARDO'].includes(animal)) {
            const animaisPresentes = [...recinto.animaisPresentes.keys()];
            if (animaisPresentes.some(tipoAnimal => ['LEAO', 'LEOPARDO'].includes(tipoAnimal))) {
                return 'Leões e leopardos não podem compartilhar o mesmo recinto.';
            }
        }
    
        if (animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
            return 'Hipopótamos só podem ser colocados em biomas de savana e rio.';
        }
    
        if (!this.podeAdicionarComOutrosAnimais(recinto.animaisPresentes, animal)) {
            return 'Carnívoros e herbívoros não podem ser misturados no mesmo recinto.';
        }
    
        return 'ok';
    }

    podeAdicionarComOutrosAnimais(animaisPresentes, novoAnimal) {
        if (novoAnimal === 'MACACO') {
            return animaisPresentes.size > 0;
        }

        const carnivoros = ['LEAO', 'LEOPARDO', 'CROCODILO'];
        const herbivoros = ['GAZELA', 'HIPOPOTAMO'];

        const contemCarnivoro = [...animaisPresentes.keys()].some(animal => carnivoros.includes(animal));
        const contemHerbivoro = [...animaisPresentes.keys()].some(animal => herbivoros.includes(animal));

        if (carnivoros.includes(novoAnimal) && contemHerbivoro) {
            return false;
        }

        if (herbivoros.includes(novoAnimal) && contemCarnivoro) {
            return false;
        }

        return true;
    }

    calcularEspacoOcupado(recinto) {
        return [...recinto.animaisPresentes.entries()].reduce((total, [animal, quantidade]) => {
            return total + this.tamanhosAnimais[animal] * quantidade;
        }, 0);
    }

    analisaRecintos(animal, quantidade) {
       
        if (!this.tamanhosAnimais[animal]) {
            return { erro: "Animal inválido", recintosViaveis: [] };
        }

       
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: [] };
        }

        // Encontrar recintos viáveis
        const recintosViaveis = this.listarRecintosViaveis(animal, quantidade).map(recinto => {
            const espacoOcupado = this.calcularEspacoOcupado(recinto);
            const espacoLivre = recinto.tamanhoTotal - espacoOcupado;
            return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
        });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: [] };
        }

        return { erro: null, recintosViaveis };
    }
}

export default RecintosZoo;
