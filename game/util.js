Context =
{
    canvas : null,
    context : null,
    create : function(canvas_tag_id)
    {
        this.canvas = document.getElementById(canvas_tag_id);
        this.context = this.canvas.getContext("2d");
        return this.context;
    }
};
Sprite = function(filename)
{
    this.image = null;
    this.pattern = null;
    if (filename != undefined && filename != "" && filename != null)
    {
        this.image = new Image();
        this.image.src = filename;
    }
    else
        console.log("unable to load sprite.");
    this.draw = function(x, y, w, h)
    {
        if (w != undefined && h != undefined)
        {
            //image
            Context.context.drawImage(this.image, x, y, w, h);
        }
        else
        {
            //stretched
            Context.context.drawImage(this.image, x, y, this.image.width, this.image.height);
        }
    }
};

function getRandomInteger(lower, upper)
{
    //R = parseInt(rnd * (upper - (lower - 1)) + lower
    multiplier = upper - (lower - 1);
    rnd = parseInt(Math.random() * multiplier) + lower;
    return rnd;
}

            function displayStats()
{
    strengthStat.innerHTML = statsArray[0];
    vitalityStat.innerHTML = statsArray[1];
    intelligenceStat.innerHTML = statsArray[2];
    agilityStat.innerHTML = statsArray[3];
    spanPoints.innerHTML = statPoints;
    if (statPoints > 0)
    {
        for (i = 0; i < pluses.length; i++)
            pluses[i].style.display = "inline-block";
    }
    else
    {
        for (i = 0; i < pluses.length; i++)
            pluses[i].style.display = "none";               
    }

}
function createInterval(wMap)
{
    enemyX = null;
    enemyY = null;
    id = setInterval(function()
    {
        Context.context.clearRect(0,0,canvas.width,canvas.height);
        for (var y = 0; y < wMap.length; y++)
        {
            for (var x = 0; x < wMap[0].length; x++)
            {
                var tileX = x*blockWidth;
                var tileY = y*blockHeight;
                if  (wMap[y][x] == 0)
                    oneWall.draw(tileX, tileY, blockWidth, blockHeight);
                else
                {
                    if (wMap[y][x] == 1)
                        terrain.draw(tileX,tileY,blockWidth,blockHeight);
                    else
                    {
                        if (wMap[y][x] == 2)
                        {
                            enemy.draw(tileX, tileY, blockWidth, blockHeight);
                            enemyX = tileX;
                            enemyY = tileY;
                            enemyXtile = tileX/blockWidth;
                            enemyYtile = tileY/blockHeight;
                        }
                        else
                        {
                            boss.draw(tileX, tileY, blockWidth, blockHeight);
                            enemyX = tileX;
                            enemyY = tileY;
                            enemyXtile = tileX/blockWidth;
                            enemyYtile = tileY/blockHeight;
                        }
                    }
                }
            }
        }
        character.draw(characterX, characterY, 100,100);
        //enemy.draw(enemyX,enemyY, 100, 100);          
    }, 25);
}
function createSprites()
{
    var WALL = "wall.png";
    oneWall = new Sprite(WALL, false);
    character = new Sprite("sorlostand.png", false);
    enemy = new Sprite("enemy.png", false)
    terrain = new Sprite("boulder.png", false);
    boss = new Sprite("FINALBOSS.png", false);

}
function move(event)
{
    if (!inBattle)
    {
        if (!inMenu)
        {
            keycode = event.keyCode;
            prevXtile = characterXtile;
            prevYtile = characterYtile;
            if (keycode == W)
                characterY -= 100;

            if (keycode == D)
                characterX += 100;

            if (keycode == S)
                characterY += 100;

            if (keycode == A)
                characterX -= 100;

            if (keycode == 109)
            {
                clearInterval(id);
                menu.style.display = "block";
                inMenu = true;
            }

            characterXtile = characterX / blockWidth;
            characterYtile = characterY / blockHeight;
            detectCollision();
        }
        else
        {
            buttonsEvent(menuButtons);
            if (keycode == 109)
            {
                menu.style.display = "none";
                inMenu = false;
                createInterval(currentMap);
            }
            selected = menuButtons[buttonIdx];  
            selected.style.backgroundColor = "gray";    
            if (selected.innerHTML == "Stats")
            {
                stats.style.display = "block";
                magic.style.display = "none";
            }
            else
            {
                stats.style.display = "none";
                magic.style.display = "block";
            }
        }
    }
    else
    {
        if (turn == PLAYER)
        {
            if (!inMagic)
            {
                buttonsEvent(buttons);  
                selected = buttons[buttonIdx];
                if (keycode == Xcode && !inAnimation)
                {
                    if (selected.innerHTML == "run")
                    {
                        if (Math.random() < 0.5)
                        {
                            inAnimation = true;
                            setTimeout(function()
                            {
                                feedback.innerHTML = "Successfully ran!";
                            }, 250);
                            setTimeout(function()
                            {
                                endBattle();
                                inAnimation = false;
                            },1250);
                        }
                        else
                        {
                            feedback.innerHTML = "Running failed!";
                            attackAnimation(enemy);
                        }

                    }
                    if (selected.innerHTML == "attack")
                        attackAnimation(character, selected.innerHTML);
                    if (selected.innerHTML == "item")
                    {
                        inAnimation = true;
                        feedback.innerHTML = "That does nothing.";
                        setTimeout(function()
                        {
                            feedback.innerHTML = "Choose an action.";
                            inAnimation = false;
                        }, 1250);
                    }
                    if (selected.innerHTML == "magic")
                    {
                        magics.style.display = "block";
                        actions.style.display = "none";
                        inMagic = true;
                    }
                }
            }
            else
            {
                buttonsEvent(magicButtons);
                selected = magicButtons[buttonIdx];
                selected.style.backgroundColor = "gray";
                if (keycode == Xcode && !inAnimation)
                {
                    if (selected.innerHTML == "Back")
                    {
                        magics.style.display = "none";
                        actions.style.display = "block";
                        inMagic = false;
                        inAnimation = false;
                        return;
                    }
                    attackAnimation(character, selected.innerHTML);
                }
            }
            selected.style.backgroundColor = "gray";
        }
    }
}

function buttonsEvent(which)
{
    for (var i = 0; i < which.length; i++)
        which[i].style.backgroundColor = "initial"
    keycode = event.keyCode;

    if (keycode == D)
        buttonIdx++;
    if (keycode == A)
        buttonIdx--;

    if (buttonIdx >= which.length)
        buttonIdx = buttonIdx - which.length

    if (buttonIdx < 0)
        buttonIdx = which.length + buttonIdx;                       
}
function attackAnimation(who, type)
{
    if (who == character)
    {
        inAnimation = true;
        if (type == "attack")
        {
            damage = Math.round((statsArray[STRENGTH]*1.2)/getRandomInteger(statsArray[STRENGTH] - 6, statsArray[STRENGTH] - 4));
            playerMove(type);
            return;
        }
        else
        {
            if (type == "Firebolt" && statsArray[INTELLIGENCE] >= 10)
            {
                damage = 7;
                playerMove(type);
                return;
            }
            else
            {
                if (type == "Heal" && statsArray[INTELLIGENCE] >= 15)
                {
                    heal = 5;
                    setTimeout(function()
                    {

                        playerHealth += heal;
                        if (playerHealth > 30 + statsArray[VITALITY] - 8)
                        {
                            playerHealth = 30 + statsArray[VITALITY] - 8;
                            feedback.innerHTML = "You healed yourself by " + heal + " health points!";
                            attackAnimation(enemy);
                        }
                    },1000);
                }
                else
                {
                    if (type == "fireblast" && statsArray[INTELLIGENCE] >= 20)
                    {
                        damage = 12;
                        playerMove(type);
                    }
                    else
                    {
                        feedback.innerHTML = "This spell is not unlocked.";
                        setTimeout(function()
                        {
                            feedback.innerHTML = "Choose an action.";
                            inAnimation = false;
                        },1000);
                    }

                }
            }
        }

    }
    if (who == enemy)
    {
        inAnimation = true;
        damage = Math.round(enemyStrength/getRandomInteger(1,mapy + 3));
        setTimeout(function()
        {
            enemyBattleX = characterX - 350;
            enemyBattleY = characterY - 100;
            playerHealth -= damage;
        }, 250);

        setTimeout(function()
        {
            enemyBattleX = Math.floor(canvas.width/6);
            enemyBattleY = Math.floor(canvas.height/3);
            turn = PLAYER;
        },800);
        setTimeout(function()
        {
            feedback.innerHTML = "The enemy dealt " + damage + " damage!" + "<br />";
            if (playerHealth > 0)
                feedback.innerHTML += "Choose an action."
            inAnimation = false;
        },1400);
        if (playerHealth < 0)
        {
            setTimeout(function()
            {
                feedback.innerHTML = "You died! Refresh the page to" + "<br / " + "restart";
            },250);
        }
    }
}
function playerMove(type)
{
    setTimeout(function()
    {
        if (type == "attack")
        {
            characterX = enemyBattleX + 400;
            characterY = enemyBattleY + 100;
        }
        enemyHealth -= damage;
        feedback.innerHTML = "You dealt " + damage + " damage to the enemy!";                       
    }, 150);
    setTimeout(function()
    {
        characterX = Math.floor(canvas.width/1.2);
        characterY = Math.floor(canvas.height/1.8);
        if (enemyHealth > 0)
            attackAnimation(enemy);
        else
        {       
            experience += enemyStrength * 100;
            feedback.innerHTML = "You have defeated the enemy!";
            if (experience > 150)
            {
                var lvls = experience/150;
                var lvls2 = Math.floor(lvls);
                statPoints += lvls2;
                lvls -= Math.floor(lvls);
                experience = lvls * 150;
                playerHealth = 30 + statsArray[VITALITY] - 8;
                displayStats();
                setTimeout(function()
                {
                    feedback.innerHTML = "You leveled up " + lvls2 + " time(s)!";
                },1500);
                setTimeout(function()
                {
                    currentMap[enemyYtile][enemyXtile] = 0;
                    inAnimation = false;
                    endBattle();
                },3500);
            }
        }
    }, 800);            

}
function statUp(idx)
{
    statsArray[idx]++;

    if (idx == VITALITY)
    {
        playerHealth++;
    }

    if (statsArray[INTELLIGENCE] == 10)
        firebolt.innerHTML = "";
    if (statsArray[INTELLIGENCE] == 15)
        heal.innerHTML = "";
    if (statsArray[INTELLIGENCE] == 20)
        fireblast.innerHTML = "";

    statPoints--;       
    displayStats();
}
function detectCollision()
{
    if (characterX == enemyX && characterY == enemyY)
    {
        clearInterval(id);

        characterX = Math.floor(canvas.width/1.2);
        characterY = Math.floor(canvas.height/1.8);
        enemyBattleX = canvas.width/6;
        enemyBattleY = canvas.height/3;                 

        inBattle = true;
        if (currentMap[enemyY/blockHeight][enemyX/blockWidth] == 3)
        {
            enemyHealth = 100;
            enemyStrength = 6;
        }
        else
        {
            enemyStrength = getRandomInteger(2,4)
            enemyHealth = Math.ceil(enemyStrength / (mapy + 1))*10;
        }
        initialHealth = enemyHealth;
        playerInitialHealth = playerHealth;
        turn = PLAYER;

        feedback.innerHTML = "Choose an action.";
        if (currentMap == map6)
        {
            battleStart = setInterval(function()
            {
                battle(boss);
            },25);
        }
        else
        {
            battleStart = setInterval(function()
            {
                battle(enemy);
            },25);
        }
        selected = buttons[buttonIdx];
        selected.style.backgroundColor = "gray";
        return;

    }
    if (characterY == -100)
    {
        mapy--;
        if (mapy < 0)
            mapy++;
        else
        {
            currentMap = mapArray[mapy][mapx];
            clearInterval(id);
            createInterval(currentMap);
            characterY = canvas.height - blockHeight;
        }
    }
    else
    {
        if (characterY == canvas.height)
        {
            mapy++;
            if (mapy == mapArray.length)
                mapy--
            else
            {
                clearInterval(id);
                currentMap = mapArray[mapy][mapx];
                createInterval(currentMap);
                characterY = 0;
            }
        }
        else
        {
            if (characterX == -100)
            {
                mapx--;
                if (mapx < 0 || mapArray[mapy][mapx] == NOMAP)
                    mapx++
                else
                {
                    currentMap = mapArray[mapy][mapx];
                    clearInterval(id);
                    createInterval(currentMap);
                    characterX = canvas.width - blockWidth;
                }
            }
            else
            {
                if (characterX == canvas.width)
                {
                    mapx++
                    if (mapx == mapArray[mapy].length || mapArray[mapy][mapx] == NOMAP)
                        mapx--;
                    else
                    {
                        currentMap = mapArray[mapy][mapx];
                        clearInterval(id);
                        createInterval(currentMap);
                        characterX = 0;                                 
                    }
                }
            }
        }
    }
    if (characterY < 0)
        characterY = 0;
    if (characterY > canvas.height - blockHeight)
        characterY = canvas.height - blockHeight;
    if (characterX < 0)
        characterX = 0;
    if (characterX > canvas.width - blockWidth)
        characterX = canvas.width - blockWidth;

    characterXtile = characterX / blockWidth;
    characterYtile = characterY / blockHeight;
    if (currentMap[characterYtile][characterXtile] == 1)
    {
        characterX = prevXtile * blockWidth;
        characterY = prevYtile * blockHeight;
        characterXtile = prevXtile;
        characterYtile = prevYtile;
    }
}
function endBattle()
{
    battleTray.style.display = "none";
    playerHealthDisplay.style.display = "none";
    enemyHealthDisplay.style.display = "none";
    healthDisplay.style.display = "none";
    if (enemyHealth < 0)
    {
        characterX = enemyX;
        characterY = enemyY;
        if (currentMap == map6)
        {
            clearInterval(id);

        }
    }
    else
    {
        characterX = enemyX;
        characterY = enemyY + 100;
        while (currentMap[characterY/blockHeight][characterX/blockWidth] == 1)
        {
            characterY = enemyY + getRandomInteger(0,1)*blockHeight;
            characterX = enemyX + getRandomInteger(0,1)*blockWidth;
        }
        inAnimation = false;
    }

    inBattle = false;
    createInterval(currentMap);
    clearInterval(battleStart);             
}
function battle(who)
{
    Context.context.clearRect(0,0,canvas.width,canvas.height);
    Context.context.fillStyle = "#000000";
    Context.context.fillRect(0,0,canvas.width,canvas.height);               
    battleTray.style.display = "block";
    character.draw(characterX,characterY,100,100);
    who.draw(enemyBattleX, enemyBattleY, 300,300);
    playerHealthDisplay.innerHTML = playerHealth + "/" + playerInitialHealth;
    playerHealthDisplay.style.display = "block";
    enemyHealthDisplay.style.display = "block";
    healthDisplay.style.display = "block";
    enemyHealthDisplay.innerHTML = enemyHealth + "/" + initialHealth;
}
