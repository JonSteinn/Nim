package gui;

import javafx.application.Application;
import javafx.stage.Stage;

public class Main extends Application {

    @Override
    public void start(Stage primaryStage) throws Exception{
        primaryStage.setTitle("Minesweeper");
        primaryStage.setScene(Controller.main.getScene());
        primaryStage.show();
    }


    public static void main(String[] args) {
        launch(args);
    }
}
