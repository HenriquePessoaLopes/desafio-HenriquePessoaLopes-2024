//Essa é a classe main do menu, coloque "node index.js" no terminal.
import RecintosZoo from './src/recintos-zoo.js';
import readline from 'node:readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const zoo = new RecintosZoo();

const perguntar = (pergunta) => {
    return new Promise(resolve => rl.question(pergunta, resolve));
};

const main = async () => {
    while (true) {
        console.log("\nMenu:");
        console.log("1 - Adicionar animal ao recinto");
        console.log("2 - Listar recintos");
        console.log("3 - Retirar animal do recinto");
        console.log("4 - Sair");
        const opcao = await perguntar("Escolha uma opção: ");
        
        switch (opcao) {
            case '1':
                await adicionarAnimal();
                break;
            case '2':
                await listarRecintos();
                break;
            case '3':
                await retirarAnimal();
                break;
            case '4':
                console.log("Saindo...");
                rl.close();
                return;
            default:
                console.log("Opção inválida.");
        }
    }
};

const adicionarAnimal = async () => {
    while (true) {
        const animalAdd = (await perguntar("Digite o tipo de animal (ou digite '5' para voltar): ")).trim().toUpperCase();
        
        if (animalAdd === '5') return;

        const quantidade = parseInt((await perguntar("Digite a quantidade: ")), 10);
        
        if (isNaN(quantidade) || quantidade <= 0) {
            console.log("Quantidade inválida.");
            continue;
        }

        const recintosNaoViaveis = [];
        const recintosPodeEntrar = [];

        zoo.getRecintos().forEach(recinto => {
            const motivo = zoo.podeAlocarAnimalComMotivo(recinto, animalAdd, quantidade);
            if (motivo !== 'ok') {
                recintosNaoViaveis.push({
                    numero: recinto.numero,
                    bioma: recinto.bioma,
                    motivo: motivo
                });
            } else {
                const espacoOcupado = zoo.calcularEspacoOcupado(recinto);
                const espacoLivre = recinto.tamanhoTotal - espacoOcupado;
                const espacoAnimal = zoo.tamanhosAnimais[animalAdd] * quantidade;

                recintosPodeEntrar.push({
                    numero: recinto.numero,
                    bioma: recinto.bioma,
                    tamanhoTotal: recinto.tamanhoTotal,
                    espacoDisponivel: espacoLivre,
                    espacoOcupacao: espacoAnimal
                });
            }
        });

      
        if (recintosNaoViaveis.length > 0) {
            console.log("\nRecintos onde o animal NÃO pode entrar:");
            recintosNaoViaveis.forEach(recinto => {
                console.log(`Recinto ${recinto.numero} - Bioma: ${recinto.bioma}`);
                console.log(`Motivo: ${recinto.motivo}`);
            });
        } else {
            console.log("\nTodos os recintos são viáveis.");
        }

      
        if (recintosPodeEntrar.length > 0) {
            console.log("\nRecintos onde o animal PODE entrar:");
            recintosPodeEntrar.forEach(recinto => {
                console.log(`Recinto ${recinto.numero} - Bioma: ${recinto.bioma} - Espaço Total: ${recinto.tamanhoTotal}`);
                console.log(`Espaço disponível: ${recinto.espacoDisponivel}`);
                console.log(`Espaço que o animal ocupará: ${recinto.espacoOcupacao}`);
            });
        } else {
            console.log("\nNenhum recinto disponível para este animal.");
        }

        const numeroRecinto = await perguntar("Escolha o número do recinto (ou digite '5' para voltar): ");
        
        if (numeroRecinto === '5') return;

        const numeroRecintoAdd = parseInt(numeroRecinto, 10);
        const resultadoAdd = zoo.adicionarAnimal(numeroRecintoAdd, animalAdd, quantidade);
        console.log(resultadoAdd);
    }
};

const listarRecintos = async () => {
    console.log("Recintos:");

    const recintos = zoo.getRecintos();
    if (!recintos || recintos.length === 0) {
        console.log("Nenhum recinto encontrado.");
        return;
    }

    recintos.forEach(recinto => {
        console.log(`Recinto ${recinto.numero} - Bioma: ${recinto.bioma} - Tamanho Total: ${recinto.tamanhoTotal}`);
        
     
        if (recinto.animaisPresentes.size === 0) {
            console.log("  Nenhum animal presente.");
        } else {
            console.log("  Animais presentes:");
            recinto.animaisPresentes.forEach((quantidade, animal) => {
                console.log(`    ${animal}: ${quantidade}`);
            });
        }
    });
};

const retirarAnimal = async () => {
    while (true) {
        const animalRemove = (await perguntar("Digite o tipo de animal: ")).trim().toUpperCase();
        const recintoNumero = parseInt(await perguntar("Digite o número do recinto: "), 10);
        const quantidade = parseInt(await perguntar("Digite a quantidade: "), 10);
        
        if (isNaN(quantidade) || quantidade <= 0) {
            console.log("Quantidade inválida.");
            continue;
        }

        const sucesso = zoo.retirarAnimal(recintoNumero, animalRemove, quantidade);
        console.log(sucesso ? "Animal retirado com sucesso." : "Não foi possível retirar o animal.");
        break;
    }
};

main();
