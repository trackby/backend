
-- Big Bang Theory
INSERT INTO tvshow(info, show_name, director_name, writer_name, image_url) 
VALUES ('The Big Bang Theory is centered on five characters living in Pasadena, California: roommates Leonard Hofstadter and Sheldon Cooper; Penny, a waitress and aspiring actress who lives across the hall; and Leonard and Sheldons equally geeky and socially awkward friends and co-workers, mechanical engineer Howard Wolowitz and astrophysicist Raj Koothrappali. The geekiness and intellect of the four guys is contrasted for comic effect with Pennys social skills and common sense.', 'BigBangTheory', 'Chuck Lorre', 'Bill Prady', 'https://www.birdizihaber.com/wp-content/uploads/2017/05/431311.jpg');

INSERT INTO tvshow(info, show_name, director_name, writer_name, image_url) VALUES('The world of the Vikings is brought to life through the journey of Ragnar Lothbrok', 'Vikings', 'Michael Hirst', 'Bill Prady', 'https://isfikirlerimiz.com/wp-content/uploads/2017/05/vikings-5-sezon-ne-zaman.jpg');

INSERT INTO tvshow(info, show_name, director_name, writer_name, image_url) VALUES ('Mr. Robot follows Elliot Alderson, a young computer programmer with an anxiety order, who is recruited by Mr Robot and his anarchist team of hackers fscoiety', 'Mr.Robot', 'Niels Arden Oplev', 'Sam Esmail', 'http://www.bilemezsin.com/bahisimgs/32420.jpg');

INSERT INTO tvshow(info, show_name, director_name, writer_name, image_url) VALUES ('A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his familys future.', 'BreakingBad', 'Vince Gilligan', ' Vince Gilligan', 'http://www.dipnot.tv/wp-content/uploads/2013/10/Breaking-Bad.jpg');

INSERT INTO tvshow(info, show_name, director_name, writer_name, image_url) VALUES ('Nine noble families fight for control over the mythical lands of Westeros, while a forgotten race returns after being dormant for thousands of years.', 'GameOfThrones', 'D.B. Weiss', ' George RR Martin', 'http://www.microdestek.com.tr/wp-content/uploads/2017/08/Game-of-Thrones-Season-6-HEADER.jpg');


INSERT INTO season(season_no, info, season_year, show_name) VALUES(1, 'Pilot Season.', 2006, 'BigBangTheory');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(2, 'S1, Ep2 The Big Bran Hypothesis', 'Penny is furious with Leonard and Sheldon when they sneak into her apartment and clean it while she is sleeping.', 1, 'BigBangTheory');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(3, 'S1, Ep3 The Fuzzy Boots Corollary', 'Leonard gets upset when he discovers that Penny is seeing a new guy, so he tries to trick her into going on a date with him.', 1, 'BigBangTheory');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(4, 'S1, Ep4 The Luminous Fish Effect', 'Sheldons mother is called to intervene when he delves into numerous obsessions after being fired for being disrespectful to his new boss.', 1, 'BigBangTheory');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(5, 'S1, Ep5 The Hamburger Postulate', 'Leslie seduces Leonard, but afterwards tells him that she is only interested in a one-night stand.', 1, 'BigBangTheory');

INSERT INTO season(season_no, info, season_year, show_name) VALUES(2, 'Sheldon and Wolowitz plan birthday celebrations for Amy and Halley, respectively.', 2008, 'BigBangTheory');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(1, 'S2, Ep1 The Bad Fish Paradigm', 'Leonard becomes concerned when his date with Penny ends abruptly and she starts blowing him off. When told the truth, Sheldon would rather move out than keep Pennys reasons a secret from Leonard.',2, 'BigBangTheory');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(2, 'S2, Ep2 The Codpiece Topology', 'Sheldon is annoyed when Leonard turns to Leslie for comfort after seeing Penny with another guy.',2, 'BigBangTheory');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(3, 'S2, Ep3 The Barbarian Sublimation', 'Sheldon introduces Penny to online gaming, however she refuses to quit after becoming addicted.',2, 'BigBangTheory');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(4, 'S2, Ep4 The Griffin Equivalency', 'The guys struggle to cope with Rajs arrogance after he is featured in a People magazine article.',2, 'BigBangTheory');

-- Mr Robot

INSERT INTO season(season_no, info, season_year, show_name) VALUES(1, 'A notorious hacker takes an interest in cyber security engineer and vigilante styled computer hacker Elliot, while an evil corporation is hacked.', 2015, 'Mr.Robot');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(1, 'Hello World', 'A notorious hacker takes an interest in cyber security engineer and vigilante styled computer hacker Elliot, while an evil corporation is hacked.', 1, 'Mr.Robot');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(2, 'Ones and Zeros', 'Elliot is torn between accepting a lucrative yet problematic job offer and joining the fsociety hacker group.', 1, 'Mr.Robot');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(3, 'Debug', 'Elliot attempts to lead a normal life, but cannot escape fsociety, while Gideon grows suspicious, and Tyrell plays dirty.', 1, 'Mr.Robot');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(4, 'Deamons', 'While dealing with his withdrawal, Elliot suffers a series of hallucinations about his life, while Shayla helps Angela take an unexpected trip.', 1, 'Mr.Robot');

INSERT INTO season(season_no, info, season_year, show_name) VALUES(2, 'Follows Elliot, a young programmer working as a cyber-security engineer by day, and a vigilante hacker by night.', 2016, 'Mr.Robot');
 
INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(1, 'Unmask-pt1', 'Elliot keeps seeing his psychologist, Krista. The new character Susan Jacobs is having trouble with technology. Gideon pays a visit to Elliot complaining hes been targeted for a crime Elliot might have committed. Fsociety are back in action, asking E Corp for 5.9 million dollars in 24 hours.', 2, 'Mr.Robot');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(2, 'Unmask-pt2', 'Five/nine has changed the world; Elliot is in seclusion; Angela finds happiness at Evil Corp.; fsociety delivers a malicious payload.',2, 'Mr.Robot');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(3, 'Kernel Panic','Elliot vows to beat Mr. Robot; Angela gets a glimpse behind the curtain at E Corp; and fsociety stirs up trouble.',2, 'Mr.Robot');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(4, 'Init Asec','Elliot vows to beat Mr. Robot; Angela gets a glimpse behind the curtain at E Corp; and fsociety stirs up trouble.',2, 'Mr.Robot');

-- Vikings

INSERT INTO season(season_no, info, season_year, show_name) VALUES(1, 'The stage is set for the first journey west by Ragnar Lothbrok as he gathers a crew willing to risk their lives to travel into the unknown.', 2013, 'Vikings');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(1, 'Rites of Passage', 'Ragnar goes on a trip of initiation with his son. Meanwhile, he thinks he has finally found a way to sail ships to the west. However, his beliefs are seen as insane so he chooses to go against the law.',1, 'Vikings');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(2, 'Wrath of the Northmen', 'A monastery in Lindesfarne, England is about to get a firsthand look at how the Vikings operate.', 1, 'Vikings');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(3, 'Trial', 'The Vikings head back to England to see what other treasures this new world has to offer. This go round Ragnar and his crew sail out with Earl Haraldsons permission.', 1, 'Vikings');


-- Breaking Bad

INSERT INTO season(season_no, info, season_year, show_name) VALUES(1, 'Diagnosed with terminal lung cancer, chemistry teacher Walter White teams up with his former student, Jesse Pinkman, to cook and sell crystal meth.', 2008, 'BreakingBad');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(1, 'Cats in the Bag...', 'After their first drug deal goes terribly wrong, Walt and Jesse are forced to deal with a corpse and a prisoner. Meanwhile, Skyler grows suspicious of Walts activities.',1, 'BreakingBad');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(2, '..And the Bags in the River', 'Walt is struggling to decide if it s best to kill Krazy-8 or let him go.', 1, 'BreakingBad');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(3, 'Cancer Man', 'Walt tells the rest of his family about his cancer. Jesse tries to make amends with his own parents.', 1, 'BreakingBad');

INSERT INTO season(season_no, info, season_year, show_name) VALUES(2, 'Diagnosed with terminal lung cancer, chemistry teacher Walter White teams up with his former student, Jesse Pinkman, to cook and sell crystal meth.', 2008, 'BreakingBad');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(1, 'Seven Thirty-Seven', 'Walt and Jesse realize how dire their situation is. They must come up with a plan to kill Tuco before Tuco kills them first.',2, 'BreakingBad');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(2, 'Grilled', 'Tuco takes Walt and Jesse prisoner.', 2, 'BreakingBad');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(3, 'Bit by a Dead Bee', 'Walt and Jesse try to come up with alibis for their disappearances.', 2, 'BreakingBad');

INSERT INTO season(season_no, info, season_year, show_name) VALUES(3, 'Diagnosed with terminal lung cancer, chemistry teacher Walter White teams up with his former student, Jesse Pinkman, to cook and sell crystal meth.', 2008, 'BreakingBad');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(1, 'No Más', 'Skyler goes through with her plans to divorce Walt. Jesse finishes rehab.',3, 'BreakingBad');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(2, 'Caballo sin Nombre', 'Walter, Jr. is having a rough time accepting his parents separation. Jesse buys his old house from his parents. Meanwhile, two mysterious men have come into town looking for Walt.', 3, 'BreakingBad');

-- Game Of Thrones

INSERT INTO season(season_no, info, season_year, show_name) VALUES(1, 'on Arryn, the Hand of the King, is dead. King Robert Baratheon plans to ask his oldest friend, Eddard Stark, to take Jons place. Across the sea, Viserys Targaryen plans to wed his sister to a nomadic warlord in exchange for an army.', 2008, 'GameOfThrones');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(1, 'The Kingsroad', 'While Bran recovers from his fall, Ned takes only his daughters to Kings Landing. Jon Snow goes with his uncle Benjen to the Wall. Tyrion joins them.',1, 'GameOfThrones');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(2, 'Lord Snow', 'ord Stark and his daughters arrive at Kings Landing to discover the intrigues of the kings realm.', 1, 'GameOfThrones');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(3, 'Cripples, Bastards, and Broken Things', 'Eddard investigates Jon Arryns murder. Jon befriends Samwell Tarly, a coward who has come to join the Nights Watch.', 1, 'GameOfThrones');


INSERT INTO season(season_no, info, season_year, show_name) VALUES(2, 'The North Remembers', 2008, 'GameOfThrones');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(1, 'The North Remembers', 'Tyrion arrives at Kings Landing to take his fathers place as Hand of the King. Stannis Baratheon plans to take the Iron Throne for his own. Robb tries to decide his next move in the war. The Nights Watch arrive at the house of Craster..',2, 'GameOfThrones');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(2, 'The King Lands', 'Arya makes friends with Gendry. Tyrion tries to take control of the Small Council. Theon arrives at his home, Pyke, in order to persuade his father into helping Robb with the war. Jon tries to investigate Crasters secret.', 2, 'GameOfThrones');

INSERT INTO episode(episode_no, episode_name, info, season_no, show_name) VALUES(3, 'What Is Dead May Never Die', 'Tyrion tries to see who he can trust in the Small Council. Catelyn visits Renly to try and persuade him to join Robb in the war. Theon must decide if his loyalties lie with his own family or with Robb.', 2, 'GameOfThrones');
