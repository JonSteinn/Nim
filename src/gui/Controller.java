package gui;

import game.Board;
import javafx.application.Platform;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.Slider;
import javafx.scene.input.KeyCode;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

import java.util.Random;

/**
 * Created by Jonni on 6/7/2017.
 */
public class Controller {
    private static Random r = new Random();
    public static Controller main = new Controller();

    private Scene scene;
    private BorderPane root;
    private Slider slider;
    private Board board;
    private int nextHeaps;
    private Label message;
    private GridPane buttonsWrapper;
    private Button[][] buttons;

    private Controller() {
        this.root = new BorderPane();
        this.scene = new Scene(root);
        this.scene.getStylesheets().add(getClass().getResource("styles.css").toExternalForm());
        this.scene.setOnKeyPressed((e) -> {
            switch (e.getCode()) {
                case ESCAPE:
                    Platform.exit();
                case DIGIT3:
                    this.slider.setValue(3);
                    nextHeaps = 3;
                    break;
                case DIGIT4:
                    this.slider.setValue(4);
                    nextHeaps = 4;
                    break;
                case DIGIT5:
                    this.slider.setValue(5);
                    nextHeaps = 5;
                    break;
                case DIGIT6:
                    this.slider.setValue(6);
                    nextHeaps = 6;
                    break;
                case DIGIT7:
                    this.slider.setValue(7);
                    nextHeaps = 7;
                    break;
                case SPACE:
                    newGame();
            }
        });

        this.buttons = new Button[7][10];
        for (int i = 0; i < 7; i++) {
            for (int j = 0; j < 10; j++) {
                buttons[i][j] = new Button("                ");
                buttons[i][j].getStyleClass().add("cBtn");
            }
        }
        this.buttonsWrapper = new GridPane();
        this.buttonsWrapper.setPadding(new Insets(15,25,15,25));
        this.buttonsWrapper.setHgap(20);
        for (int i = 0; i < 7; i++) {
            for (int j = 0; j < 10; j++) {
                buttonsWrapper.add(buttons[i][9-j], i , j);
            }
        }

        this.message = new Label(" ");
        this.message.setDisable(true);
        nextHeaps = 3;

        VBox sliderWrapper = new VBox();
        sliderWrapper.setPadding(new Insets(5,5,5,5));
        sliderWrapper.setAlignment(Pos.CENTER);
        this.slider = new Slider(3,7,1);
        slider.setShowTickLabels(true);
        slider.valueProperty().addListener((obs, oldval, newVal) -> {
                slider.setValue(newVal.intValue());
                nextHeaps = newVal.intValue();
        });
        sliderWrapper.getChildren().addAll(slider, message);

        VBox newGameBtnWrapper = new VBox();
        Button newGameBtn = new Button("New Game");
        newGameBtn.setOnAction((e) -> newGame());
        newGameBtnWrapper.setPadding(new Insets(5,5,5,5));
        newGameBtnWrapper.setAlignment(Pos.CENTER);
        newGameBtnWrapper.getChildren().add(newGameBtn);

        this.root.setBottom(sliderWrapper);
        this.root.setCenter(buttonsWrapper);
        this.root.setTop(newGameBtnWrapper);

        newGame();
    }

    public Scene getScene() {
        return this.scene;
    }

    private void newGame() {
        this.board = new Board(nextHeaps, r);
    }
}
