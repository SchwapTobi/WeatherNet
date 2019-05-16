package Maps;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import static Constants.Files.*;
import static Constants.Characters.*;

public class State {

    private static final Map<String,String> ZIP_STATE_MAP = new HashMap<>();

    private static String zip;
    private static String country;

    private static String line = EMPTY; // for while
    private static BufferedReader reader;

    public static Map<String,String> getZipStateMap(){

        try {
            reader = new BufferedReader(new InputStreamReader(new FileInputStream(STATE_COUNTRY), StandardCharsets.UTF_8));

            // skip unused lines
            skipLines(6, reader);

            while (line != null){
                zip = zipFormat(reader.readLine());
                skipLines(1, reader);

                line = reader.readLine();
                country = stateName(line);

                // skip unused lines
                skipLines(8, reader);
                ZIP_STATE_MAP.put(zip, country);
            }
            line = null;

            reader.close();
            reader = null;

        } catch (Exception e){
            e.printStackTrace();
        }
        return ZIP_STATE_MAP;
    }

    private static String zipFormat(String s){
        if (s != null) {
            return s.replaceAll("\\\"",EMPTY)
                    .replaceAll("\\s+",EMPTY)
                    .replace("plz:",EMPTY)
                    .replace(COMMA,EMPTY);
        }
        return null;
    }

    private static void skipLines(int num, BufferedReader reader) throws IOException {
        for (int count = 0; count < num; count++, reader.readLine());
    }

    private static String stateName(String s){
        if (s == null)return null;
        s = s
                .replaceAll("\\\"",EMPTY)
                .replaceAll("bundesland:",EMPTY)
                .replaceAll(COMMA,EMPTY);

        if (s.contains("W")){
            return "Wien";
        } else if (s.contains("N")){
            return "Niederösterreich";
        } else if (s.contains("V")){
            return "Vorarlberg";
        } else if (s.contains("K")){
            return "Kärnten";
        } else if (s.contains("B")){
            return "Burgenland";
        } else if (s.contains("Sa")){
            return "Salzburg";
        } else if (s.contains("T")){
            return "Tirol";
        } else if (s.contains("St")){
            return "Steiermark";
        } else if (s.contains("O")){
            return "Oberösterreich";
        } else {
            return "FAIL";
        }
    }


}
