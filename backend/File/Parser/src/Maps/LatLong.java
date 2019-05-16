package Maps;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import static Constants.Files.*;
import static Constants.Characters.*;

public class LatLong {

    private static final Map<String,String> LAT_LONG_MAP = new HashMap<>();

    private static String line;
    private static BufferedReader reader;

    public static Map<String,String> getLatLongMap(){
        try {
            reader = new BufferedReader(new InputStreamReader(new FileInputStream(LATITUDE_LONGITUDE), StandardCharsets.UTF_8));

            // skip first line
            line = reader.readLine();

            while ((line = reader.readLine()) != null){
                // split read data line
                String[] locData = line.split(SEMICOLON);

                // key = PLZ
                // val = lat, long
                LAT_LONG_MAP.put(locData[0], locData[2] + SEMICOLON + locData[3]);
            }
            line = null;

            reader.close();
            reader = null;

        } catch (Exception e){
            e.printStackTrace();
        }
        return LAT_LONG_MAP;
    }
}