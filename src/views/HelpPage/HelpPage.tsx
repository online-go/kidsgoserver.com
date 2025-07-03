/*
 * Copyright (C) 2012-2020  Online-Go.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from "react";
import { BackButton } from "@kidsgo/components/BackButton";

const helpSections = [
    { id: "avatars", title: "Avatars" },
    { id: "starting", title: "Starting a Game" },
    { id: "boards", title: "Board Sizes" },
    { id: "ending", title: "Ending the Game" },
    { id: "scoring", title: "Scoring the Game" },
    { id: "kids", title: "Playing Other Kids" },
    { id: "chat", title: "Chatting" },
    { id: "lessons", title: "Lessons" },
    { id: "about", title: "About" },
];

function BackToTopButton() {
    const handleClick = () => {
        document
            .getElementById("scroll-top-anchor")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return <button onClick={handleClick}>Back to Top</button>;
}

export function HelpPage(): JSX.Element {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (
        <div className="HelpPage">
            <div id="scroll-top-anchor" />
            <nav className="HelpNav">
                <div className="NavHeader">
                    <BackButton
                        onClick={() => {
                            history.back();
                        }}
                    />
                    <h2 className="HelpNavTitle">Help Topics</h2>
                </div>
                <ul className="HelpNavList">
                    {helpSections.map((section) => (
                        <li key={section.id}>
                            <button
                                className="HelpNavLink"
                                onClick={() => {
                                    const el = document.getElementById(section.id);
                                    if (el) {
                                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }
                                }}
                            >
                                {section.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <main className="HelpContent">
                <section id="avatars">
                    <h2>Avatars</h2>
                    <p>
                        Your avatar is how you will appear to other players on the server. To change
                        your player Avatar, click "Avatar" in the top left of the play page. There
                        are five different species, and hundreds of options. Changing species
                        automatically changes planets as well. You can choose species from the bar
                        at top, and try different avatars by clicking the left and right arrows.
                        When you are happy with your avatar, click "Done - I love it!" This avatar
                        will load by default next time you use the server with the same device. You
                        can change your name without changing your avatar by clicking "Change Name".
                        You can change both your name and your avatar as often as you like.
                    </p>
                    {isMobile && <BackToTopButton />}
                </section>

                <section id="starting">
                    <h2>Starting a Game</h2>
                    <p>
                        You can choose your opponent on the game creation page. There are many skill
                        levels in Go, so you are encouraged to choose a handicap to play at so the
                        game is fair for both players. The Beginner Bot will automatically give you
                        4 stones to start out with. Weak Bot gives two stones, and Easy Bot plays
                        even. You can change how many handicaps you want to play with at the bottom
                        of the screen. You can also change color if you want to be white, or give
                        your opponent a handicap. In general, if a player wins all the time, they
                        should give a handicap to the other player. Consider one stone for every 7
                        points, so if you win by 21 points you could try giving a 3 stone handicap.
                        It will take a few games with a player to see what the right handicap should
                        be. If you don’t know, just play even. If someone wins 2 or more times,
                        adjust the handicap.
                    </p>
                    {isMobile && <BackToTopButton />}
                </section>

                <section id="boards">
                    <h2>Board Sizes</h2>
                    <p>
                        The beginner board is 9x9, and that's where we recommend you start out. Once
                        you understand how to play on that size, try 13x13 for a bigger challenge.
                        Full size Go is played on 19x19 boards. We don't offer 19x19 on this site,
                        but visit{" "}
                        <a href="https://online-go.com/" target="_blank" rel="noopener">
                            OGS
                        </a>{" "}
                        or{" "}
                        <a href="https://www.gokgs.com/index.jsp" target="_blank" rel="noopener">
                            KGS
                        </a>{" "}
                        if you want to play full size.
                    </p>
                    {isMobile && <BackToTopButton />}
                </section>

                <section id="ending">
                    <h2>Ending the Game</h2>
                    <p>
                        To end the game, you must pass. Two passes in a row end the game. The pass
                        button is at the bottom right during a game. If you can’t capture anything,
                        and you can only fill your own territory, you should pass. Spaces between
                        living groups are called neutral points. Neither player gets a point for
                        these, but you must fill them in to end the game. If you play in your own
                        territory, and the other player takes a neutral point, you actually lose one
                        point. You get points for the empty space, not the full space. You can also
                        resign a game to end it at any point, and the bots will often resign when
                        you are winning.
                    </p>
                    {isMobile && <BackToTopButton />}
                </section>

                <section id="scoring">
                    <h2>Scoring the Game</h2>
                    <p>
                        In an even game, starting is a big advantage. To make it fair, blue has to
                        pay white 7.5 points at the start of the game. This is called Komi. In a
                        handicap game komi is half a point. We use this to break ties, so white
                        always wins ties because of the half point. Reading the score can be
                        confusing, and if you didn’t surround and capture stones that can’t survive
                        in your territory, they won’t be added to your total. So remember to capture
                        everything you can. If you want to look at the board after the game, click
                        view game. The little squares represent territory - white or blue. If you
                        want to look at the score again, click show score. Your score is the total
                        of your territory, plus komi, minus any prisoners you lost. When you are
                        done, click play again to return to the main playing area. This does not
                        start a new game. You must start a game with another player, or accept a
                        challenge, in order to play a new game.
                    </p>
                    {isMobile && <BackToTopButton />}
                </section>

                <section id="kids">
                    <h2>Playing Other Kids</h2>
                    <p>
                        If there are other kids waiting to play, they will show up under Kids to
                        Play. Click on an opponent, choose color, board size, and handicap and click
                        Play. They will receive an invitation to play. If they don’t like the
                        handicap or color, they can refuse the game invitation, change the settings
                        to whatever they like, and challenge you back. If they accept the invitation
                        you can play. If there are no kids to play, you can wait and see if someone
                        shows up, or you can play a bot. Players who are in a game do not show up on
                        the list of kids to play until after their game ends.
                    </p>
                    {isMobile && <BackToTopButton />}
                </section>

                <section id="chat">
                    <h2>Chatting</h2>
                    <p>
                        During the game, you can use limited chat messages by clicking on the chat
                        icon at the bottom of the screen. You can pick from a list of things to say,
                        but you cannot type or enter anything other than these messages. This is a
                        child security feature, so all players remain anonymous. Starting a game
                        with “Have a good game” and ending with “Thanks for the game” is polite.
                        Scroll down in the chat box to see available messages you can send.
                    </p>
                    {isMobile && <BackToTopButton />}
                </section>

                <section id="lessons">
                    <h2>Lessons</h2>
                    <p>
                        The lessons section should be completed in order, but you can stop and come
                        back as often as you like, and you can revisit any lesson if you need a
                        reminder on how something works. The 8th lesson contains 100 Go problems for
                        you to solve. The problems get harder as you progress through them, and you
                        can visit this section as often as you like.
                    </p>
                    {isMobile && <BackToTopButton />}
                </section>

                <section id="about">
                    <h2>About</h2>
                    <p>
                        This website was created by the{" "}
                        <a href="https://www.agfgo.org" target="_blank" rel="noopener noreferrer">
                            American Go Foundation
                        </a>{" "}
                        in collaboration with the{" "}
                        <a href="https://online-go.com/" target="_blank" rel="noopener noreferrer">
                            Online Go Server
                        </a>
                        , with assistance from the{" "}
                        <a href="https://www.britgo.org/" target="_blank" rel="noopener noreferrer">
                            British Go Association
                        </a>
                        . Graphics and animation are by{" "}
                        <a
                            href="https://www.nicksnyder.tv/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Nick Synder
                        </a>
                        . The lessons and general concept of the site are by Paul Barchilon and
                        Terry Benson. Initial programming and bot hosting were provided by Akita
                        Noek, with additional programming by Nathan Harwit. The majority of the
                        problems in lesson 8 were donated by{" "}
                        <a href="https://goproblems.com/" target="_blank" rel="noopener noreferrer">
                            goproblems.com
                        </a>
                        . Visit their site to access thousands more problems of all levels, for
                        free. The entire project has been funded solely by donations. If you would
                        like to contribute,{" "}
                        <a
                            href="https://www.agfgo.org/donate"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            click here
                        </a>
                        .<br></br> <br></br> Images, text, and lessons copyright 2025 by the
                        American Go Foundation.
                    </p>
                    {isMobile && <BackToTopButton />}
                </section>
            </main>
        </div>
    );
}
