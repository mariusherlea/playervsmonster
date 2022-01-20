const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 12;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_BONUS_LIFE = "PLAYER_BONUS_LIFE";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let battleLog = [];
let lastLoggedEntry;

function getMaxLifeValues() {

    const enteredValue = prompt("Maximum life for you and monster", 100);
    const parsedValue = parseInt(enteredValue);

    if (isNaN(parsedValue) || parsedValue <= 0) {
        throw {message: "Invalid user input, not a number"};
    }
    return parsedValue;
}

let chosenMaxLife;

try {
   chosenMaxLife = getMaxLifeValues();
} catch (error){
    console.log(error);
    chosenMaxLife=100;
    alert('You dont enter a number. 100 is default');
}

adjustHealthBars(chosenMaxLife);

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;


let hasBonusLife = true;

function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry =
        {
            event: ev,
            val: val,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    switch (ev) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = "MONSTER";
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = "MONSTER";
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = "PLAYER";
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = "PLAYER";
            break;
        case LOG_EVENT_BONUS_LIFE:
            logEntry.target = "PLAYER_HEAL";
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: ev,
                value: val,
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        default:
            logEntry = {};

    }
    battleLog.push(logEntry);
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function attackHandler() {

    playerAttack(MODE_ATTACK);

    monsterAttack();

    endRound();

}

function strongAttackHandler() {

    playerAttack(MODE_STRONG_ATTACK);

    monsterAttack();

    endRound();

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
    writeToLog(LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth);
    monsterAttack();
    endRound();
}

function playerAttack(mode) {
    /*   const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
       let logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;*/
    if (mode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if (mode === MODE_STRONG_ATTACK) {
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }
    const damage = dealMonsterDamage(ATTACK_VALUE);
    currentMonsterHealth -= maxDamage;
    writeToLog(logEvent,
        maxDamage,
        currentMonsterHealth,
        currentPlayerHealth);
}

function monsterAttack() {
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
}

function bonusLife() {
    const initialPlayerHealth = currentPlayerHealth;

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        alert("Bonus life saved you");
        setPlayerHealth(initialPlayerHealth);
        writeToLog(LOG_EVENT_BONUS_LIFE,
            "BONUS",
            currentMonsterHealth,
            currentPlayerHealth);
    }
}

function endRound() {

    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;

    writeToLog(LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth);

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("I won");
        writeToLog(LOG_EVENT_GAME_OVER,
            "Player Won",
            currentMonsterHealth,
            currentPlayerHealth);

    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        if (hasBonusLife) {
            bonusLife();
        } else {
            alert("Monster won");
            writeToLog(LOG_EVENT_GAME_OVER,
                "Monster Won",
                currentMonsterHealth,
                currentPlayerHealth);
        }

    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert("Draw");
        writeToLog(LOG_EVENT_GAME_OVER,
            "Draw",
            currentMonsterHealth,
            currentPlayerHealth);

    }
    if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
        reset();
    }
}

function printLogHandler() {
    /*  for (let i=0;i<battleLog.length;i++){
          console.log('------------');
      }
        for (let i=10;i>0;i--){
           console.log(i+10);
       }
       for (let i=10;i>0;){
           i--;
           console.log(i);
       }*/
   /* let j = 0;
    outerWhile:do {
        console.log("Outer", j);
        innerFor:for (let k = 0; k < 5; k++) {
            if (k === 3) {
                break outerWhile;
            }
            console.log("Inner", k);
        }
        j++;
    } while (j < 3);*/

    let z = 0;
    for (const logEntry of battleLog) {
        if (!lastLoggedEntry && lastLoggedEntry !== 0 || lastLoggedEntry < z) {
            console.log("------------");
            console.log(`#${z}`);
            for (const x in logEntry) {
                console.log(`${x}=>${logEntry[x]}`);

            }
            lastLoggedEntry = z;
            // break;
        }

        z++;

    }

    // console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);