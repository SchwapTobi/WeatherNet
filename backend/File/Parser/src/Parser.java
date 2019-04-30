import com.google.gson.GsonBuilder;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class Parser {

    // file names
    private static final String OUTPUT_FILE_NAME = "zip.json";
    private static final String INPUT_FILE_NAME = "zip.xml";

    private static String line;

    public static void main(String[] args) {
        // reader and writer
        BufferedReader xmlReader;
        BufferedWriter jsonOutputWriter;
        try {
            // setup reader and writer
            jsonOutputWriter = new BufferedWriter(new FileWriter(OUTPUT_FILE_NAME));
            xmlReader = new BufferedReader(new InputStreamReader(new FileInputStream(INPUT_FILE_NAME), StandardCharsets.UTF_8));

            // to match .json format
            jsonOutputWriter.append("[");
            jsonOutputWriter.append("\n");

            // read xml line by line
            while ((line = xmlReader.readLine()) != null){
                if (isXmlRow(line)){
                    //skip all xml related lines
                    continue;
                }
                // create new Location instance
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
                            if (Parser.line.contains(", ")){
                                // split on each ", "
                                String names[] = Parser.line.split(", ");

                                // used to differentiate id's
                                int number = 0;
                                for (String name : names) {
                                    // new Location instance
                                    Location location1 = new Location();

                                    // has same zip
                                    location1.setZipCode(location.getZipCode());
                                    location1.setName(convert(name));
                                    location1.makeId(number);
                                    locationList.add(location1);
                                    number++;
                                }
                            } else {
                                // no multiple towns with same zip code
                                location.setName(convert(Parser.line));
                                location.makeId(0);
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
                        jsonOutputWriter.append("," + "\n");
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
    }

    // check if line is xml stuff
    private static boolean isXmlRow(String s){
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
                .replaceAll(",","-")
                .replaceAll("<column>","")
                .replaceAll("</column>","");
    }

    // Location Object
    /*
    private static class Location {
        private String id;
        private String name;
        private int zipCode;
        private double latitude = 0;
        private double longitude = 0;

        public void setName(String name) {
            this.name = name;
        }

        public void setZipCode(int zip_code) {
            this.zipCode = zip_code;
        }

        public void makeId(int id){
            this.id =
                    // name + "_" +
                    this.zipCode + "_" + id;
        }
    }
    */
}
