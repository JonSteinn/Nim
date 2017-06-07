package game;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Created by Jonni on 6/7/2017.
 */
class BotTest {
    @Test
    void winningPositionTest() {
        Board b = new Board(new int[]{1,2});
        Action a = Bot.nextAction(b);
        assertEquals(1, a.amount);
        assertEquals(1, a.heap);
        b = new Board(new int[]{6,3,7});
        a = Bot.nextAction(b);
        assertEquals(5, a.amount);
        assertEquals(2, a.heap);
    }

    @Test
    void loosingPositionTest() {
        Board b = new Board(new int[]{0,4,4});
        Action a = Bot.nextAction(b);
        assertEquals(3, a.amount);
        assertTrue(a.heap == 1 || a.heap == 2);
    }
}