import RecintosZoo from './recintos-zoo';

describe('Recintos do Zoológico', () => {
    let recintosZoo;

    beforeEach(() => {
        recintosZoo = new RecintosZoo();
    });

    test('Deve rejeitar animal inválido', () => {
        const resultado = recintosZoo.analisaRecintos('INVALIDO', 1);
        expect(resultado.erro).toBe('Animal inválido');
        expect(resultado.recintosViaveis).toEqual([]);
    });

    test('Deve rejeitar quantidade inválida', () => {
        const resultado = recintosZoo.analisaRecintos('MACACO', -1);
        expect(resultado.erro).toBe('Quantidade inválida');
        expect(resultado.recintosViaveis).toEqual([]);
    });

    test('Não deve encontrar recintos para 10 macacos', () => {
        const resultado = recintosZoo.analisaRecintos('MACACO', 10);
        expect(resultado.erro).toBe('Não há recinto viável');
        expect(resultado.recintosViaveis).toEqual([]);
    });

    test('Deve encontrar recinto para 1 crocodilo', () => {
        const resultado = recintosZoo.analisaRecintos('CROCODILO', 1);
        expect(resultado.erro).toBeNull();
        expect(resultado.recintosViaveis).toContain('Recinto 4 (espaço livre: 8 total: 8)');
    });

    test('Deve encontrar recintos para 2 macacos', () => {
        const resultado = recintosZoo.analisaRecintos('MACACO', 2);
        expect(resultado.erro).toBeNull();
        expect(resultado.recintosViaveis).toContain('Recinto 1 (espaço livre: 7 total: 10)');
        expect(resultado.recintosViaveis).toContain('Recinto 2 (espaço livre: 5 total: 5)');
    });
});
