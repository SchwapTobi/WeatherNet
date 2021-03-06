import Maps.LatLong;
import Maps.LatLongLinz;
import Maps.State;
import Model.Location;
import com.google.gson.GsonBuilder;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static Constants.Files.*;
import static Constants.Characters.*;

// this class combines all data
public class Parser {

    private static String line;
    private static Map<String,String> latLong = LatLong.getLatLongMap();
    private static Map<String,String> latLongLinz = LatLongLinz.getLinzAndArea();
    private static Map<String,String> zipMap = State.getZipStateMap();

    public static void main(String[] args) {

        System.out.println("Start parsing ...");

        // reader and writer
        BufferedReader xmlReader;
        BufferedWriter jsonOutputWriter;
        try {
            // setup reader and writer
            jsonOutputWriter = new BufferedWriter(new FileWriter(OUTPUT_FILE));
            xmlReader = new BufferedReader(new InputStreamReader(new FileInputStream(LOCATION_DATA), StandardCharsets.UTF_8));

            // to match .json format
            jsonOutputWriter.append("[");
            jsonOutputWriter.append("\n");

            // read xml line by line
            while ((line = xmlReader.readLine()) != null){
                if (isXmlPart(line)){
                    //skip all xml related lines
                    continue;
                }
                // create new Model.Location instance
                Location location = new Location();

                // create ArrayList
                List<Location> locationList = new ArrayList<>();

                /*
                check next three lines:
                first line is always zip code
                second is town number -> not used by us
                third contains the name/s of the town/s
                */
                for (int lineNum = 0; lineNum < 3; lineNum++){
                    switch (lineNum) {
                        // always update line to next line after each case
                        case 0:
                            // first line
                            // get the zip
                            location.setZipCode(Integer.parseInt(parsedString(Parser.line)));
                            Parser.line = xmlReader.readLine();
                            break;
                        case 1:
                            // second line
                            // skip
                            line = xmlReader.readLine();
                            break;
                        case 2:
                            // third line
                            // get the name/s
                            line = parsedString(Parser.line);

                            // lineNum can contain multiple town names
                            // if so, split them and add them seperately with same zip
                            if (Parser.line.contains(COMMA_SPACE)){
                                // split on each ", "
                                String names[] = Parser.line.split(COMMA_SPACE);

                                // used to differentiate id's
                                int number = 0;
                                for (String name : names) {
                                    // new Location instance
                                    Location multipleLocation = new Location();

                                    // has same zip
                                    multipleLocation.setZipCode(location.getZipCode());
                                    multipleLocation.setName(convert(name));
                                    multipleLocation.makeId(number);

                                    double [] latitudeLongitude = getLatLong(multipleLocation);
                                    if (latitudeLongitude != null){
                                        multipleLocation.setLatitude(latitudeLongitude[0]);
                                        multipleLocation.setLongitude(latitudeLongitude[1]);
                                    }
                                    multipleLocation.setState(getCountry(multipleLocation));

                                    locationList.add(multipleLocation);
                                    number++;
                                }
                            } else {
                                // no multiple towns with same zip code
                                double [] latitudeLongitude = getLatLong(location);
                                if (latitudeLongitude != null){
                                    location.setLatitude(latitudeLongitude[0]);
                                    location.setLongitude(latitudeLongitude[1]);
                                }
                                location.setName(convert(Parser.line));
                                location.makeId(0);
                                location.setState(getCountry(location));
                                locationList.add(location);
                            }
                            break;
                    }
                }
                // add the location/s
                for (Location loc : locationList) {
                    try {
                        // write location to the file
                        jsonOutputWriter.append(new GsonBuilder().disableHtmlEscaping().setPrettyPrinting().create().toJson(loc));

                        // to match .json format,
                        jsonOutputWriter.append(COMMA + "\n");
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                // clear the list
                locationList.clear();
            }
            // close reader
            xmlReader.close();

            // to match .json format, close writer then
            jsonOutputWriter.append("]");
            jsonOutputWriter.close();
        } catch (Exception e){
            e.printStackTrace();
        }

        System.out.println("Done");

    }

    // check if line is xml stuff
    private static boolean isXmlPart(String s){
        return (s.equals("<row>") || s.equals("</row>") || s.equals("<table>") || s.equals("</table>") || s.contains("?xml version"));
    }

    // remove xml <column> & </column> to get only the information
    private static String parsedString (String s){
        return s.replaceAll("<column>","").replaceAll("</column>","");
    }

    // convert the name,
    // support ä, ö, ü, ...
    private static String convert(String s){
        return s.replaceAll("&#223;","ß")
                .replaceAll("&#246;","ö")
                .replaceAll("&#228;","ä")
                .replaceAll("&#252;","ü")
                .replaceAll("&#196;", "Ä")
                .replaceAll("&#214","Ö")
                .replaceAll("&#220","Ü")
                .replaceAll(COMMA,"-");
    }

    private static double[] getLatLong(Location location){
        double[] latLongArray = new double[2];
        // as we got more precise lat & long for Linz and area
        // use that, if possible

        if (latLongLinz.get(String.valueOf(location.getZipCode())) != null){
            // latitude at [0], longitude at [1]
            String[] data = latLongLinz.get(String.valueOf(location.getZipCode())).split(SEMICOLON);
            latLongArray[0] = Double.parseDouble(data[0]);
            latLongArray[1] = Double.parseDouble(data[1]);

        } else if (latLong.get(String.valueOf(location.getZipCode())) != null) {
            // latitude at [0], longitude at [1]
            String[] data = latLong.get(String.valueOf(location.getZipCode())).split(SEMICOLON);
            latLongArray[0] = Double.parseDouble(data[0]);
            latLongArray[1] = Double.parseDouble(data[1]);

        } else {
            // set null, no entry at all was found
            latLongArray = null;
        }
        return latLongArray;
    }

    private static String getCountry(Location location){
        return zipMap.get(String.valueOf(location.getZipCode()));
    }
}
