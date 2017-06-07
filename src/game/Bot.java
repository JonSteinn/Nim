package game;

import java.util.Arrays;
import java.util.Comparator;

/**
 * Created by Jonni on 6/7/2017.
 */
public final class Bot {
    private Bot() {}

    public static Action nextAction(Board board) {
        IndexValue[] b = new IndexValue[board.heaps()];
        for (int i = 0; i < board.heaps(); i++) b[i] = new IndexValue(i, board.get(i));
        Arrays.sort(b, Comparator.comparingInt(o -> -o.value));
        for (int i = 0; i < board.heaps(); i++) {
            if (b[i].value == 0) continue;
            int nimSum = 0;
            for (int j = 0; j < board.heaps(); j++) {
                if (i != j) nimSum ^= b[j].value;
            }
            for (int rem = 0; rem < b[i].value; rem++) {
                if ((rem ^ nimSum) == 0) return new Action(b[i].index, rem);
            }
        }
        return new Action(b[0].index, b[0].value - 1);
    }
}
