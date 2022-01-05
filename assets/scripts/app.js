const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 12;
const HEAL_VALUE = 20;

let chosenMaxLife = 70;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function attackHandler() {

    playerAttack("ATTACK");

    monsterAttack();

    winCondition();

}

function strongAttackHandler() {

    playerAttack("STRONG_ATTACK");

    monsterAttack();

    winCondition();

}

function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("You can't heal more than your max initial health");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    monsterAttack();
    winCondition();
}

function playerAttack(mode) {
    if (mode === "ATTACK") {
        const damage = dealMonsterDamage(ATTACK_VALUE);
        currentMonsterHealth -= damage;
    } else if (mode === "STRONG_ATTACK") {
        const damage = dealMonsterDamage(STRONG_ATTACK_VALUE);
        currentMonsterHealth -= damage;
    }
}

function monsterAttack() {
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
}

function bonusLife(){
    const initialPlayerHealth = currentPlayerHealth;

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        alert("Bonus life saved you");
        setPlayerHealth(initialPlayerHealth);
    }
}

function winCondition() {

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("I won");
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        if (hasBonusLife){
            bonusLife();
        }else if (!hasBonusLife){
            alert('Monster won');
        }
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert("Draw");
    }
}


attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler)