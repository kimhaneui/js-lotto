const LottoValidator = require('../utils/validate.js')
const { LOTTO_PRICE, PRIZES } = require('./utils/constants.js')
const LottoNumbers = require('./LottoNumbers.js')
const View = require('./view/PrintView.js')

const Lotto = {
    lottos: [],
    prize: PRIZES,
    numLottos: 0,
    profitPercentage: 0,

    getLottoPurchaseAmount(amount) {
        this.amount = LottoValidator.amountValidate(amount)
        this.buyLotto(this.amount);
    },

    buyLotto(purchaseAmount) {
        this.numLottos = Math.floor(purchaseAmount / LOTTO_PRICE);
        this.lottos = LottoNumbers.getNumbers(this.numLottos);
    },

    checkMatch(numMatches, result, lottoNumbers, bonusNumber) {
        switch (numMatches) {
            case 3:
                return result.rank === 5;
            case 4:
                return result.rank === 4;
            case 5:
                return (result.rank === 3 && lottoNumbers.includes(bonusNumber)) || result.rank === 2;
            case 6:
                return result.rank === 1;
            default:
                return false;
        }
    },

    calculatePrizes() {
        let totalPrize = 0;
        this.prize.forEach(rank => {
            totalPrize += rank.count * rank.prize;
        })

        const totalInvestment = this.lottos.length * LOTTO_PRICE;
        this.profitPercentage = ((totalPrize - totalInvestment) / totalInvestment) * 100;
        View.printResult(this.prize, this.profitPercentage)
    },

    matchedRank(winningNumbers, bonusNumber) {
        this.lottos.forEach(lottoNumbers => {
            const matchedNumbers = lottoNumbers.filter(num => winningNumbers.includes(num));
            const matchedRank = this.prize.find(result => this.checkMatch(matchedNumbers.length, result, lottoNumbers, bonusNumber));
            if (matchedRank) {
                matchedRank.count++;
            }
        });
        this.calculatePrizes();
    }
}
module.exports = Lotto;
