import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class LatLongLinz {

    private static final String INPUT_FILE_NAME = "locations.json";
    private static final String DELIMITER = "},\\{";
    private static final Map<String,String> LAT_LONG_MAP = new HashMap<>();

    private static BufferedReader reader;
    private static String [] locData;

    public static Map<String,String> getLinzAndArea(){
        try {
            reader = new BufferedReader(new InputStreamReader(new FileInputStream(INPUT_FILE_NAME), StandardCharsets.UTF_8));

            // file has only one line
            locData = reader.readLine().split(DELIMITER);
            for (String s: locData) {
                String[] data = parse(s).split(",");

                if (data.length < 5 || data[3].contains("0.00000") || data[4].contains("0.00000")){
                    // skip entry, if:
                    // length is less than 5, data is missing
                    // or a 0.0000 entry is at latitude or longitude
                    continue;
                }
                // key is zip, rest is array
                LAT_LONG_MAP.put( data[0], data[4] + ";" + data[3]);
            }

            reader.close();
            reader = null;
        } catch (Exception e){
            e.printStackTrace();
        }
        return LAT_LONG_MAP;
    }

    private static String parse(String s){
        // is needed as this input type is .json
        // remove .json
        return s.replaceAll("[\\[\\]]", "") // remove '[' and ']'
                .replaceAll(":","") // remove ':'
                .replaceAll("[\"]","")
                .replace("zip","")
                .replace("lat","")
                .replace("long","");
    }
}


