package game;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;

/**
 * Created by Jonni on 6/7/2017.
 */
public class Board {

    private int heaps[];

    public Board(int heapCount, Random generator) {
        this.heaps = new int[heapCount];
        Set<Integer> set = new HashSet<>();
        while (set.size() < 3) {
            set.clear();
            for (int i = 0; i < heapCount; i++) {
                this.heaps[i] = generator.nextInt(10) + 1;
                set.add(this.heaps[i]);
            }
        }
    }

    public void set(int heap, int amount) {
        this.heaps[heap] = amount;
    }

    public int get(int heap) {
        return this.heaps[heap];
    }

    public int heaps() {
        return this.heaps.length;
    }

    public boolean gameOver() {
        for (int h : heaps) if (h > 0) return false;
        return true;
    }
}
