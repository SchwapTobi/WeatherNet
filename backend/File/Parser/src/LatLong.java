import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class LatLong {

    private static final String INPUT_FILE_NAME = "latlong.txt";
    private static final String DELIMITER = ";";
    private static final Map<String,String> LAT_LONG_MAP = new HashMap<>();

    private static String line;
    private static BufferedReader reader;

    public static Map<String,String> getLatLongMap(){
        try {
            reader = new BufferedReader(new InputStreamReader(new FileInputStream(INPUT_FILE_NAME), StandardCharsets.UTF_8));

            // skip first line
            line = reader.readLine();

            while ((line = reader.readLine()) != null){
                // split read data line
                String[] locData = line.split(DELIMITER);

                // key = PLZ
                // val = lat, long
                LAT_LONG_MAP.put(locData[0], locData[2] + DELIMITER + locData[3]);
            }

        } catch (Exception e){
            e.printStackTrace();
        }
        return LAT_LONG_MAP;
    }
}
