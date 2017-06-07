package game;

import org.junit.jupiter.api.Test;

import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Created by Jonni on 6/7/2017.
 */
class BoardTest {
    @Test
    void boardTest() {
        Board b = new Board(7, new Random());
        assertEquals(7, b.heaps());
        assertFalse(b.gameOver());
        b.set(6,0);
        assertEquals(0, b.get(6));
        assertFalse(b.get(0) == 0);
        for (int i = 0; i < 6; i++) b.set(i, 0);
        assertTrue(b.gameOver());
    }
}