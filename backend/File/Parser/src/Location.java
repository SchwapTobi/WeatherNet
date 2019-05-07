import java.util.Objects;

public final class Location {

    // for output
    private static final String DELIMITER_COMMA = ", ";

    // for id
    private static final String DELIMITER = "_";

    private String id;
    private String name;
    private int zipCode;
    private double latitude = 0;
    private double longitude = 0;

    // getter and setter

    public String getName(){
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getZipCode(){
        return this.zipCode;
    }

    public void setZipCode(int zip_code) {
        this.zipCode = zip_code;
    }

    public String getId(){
        return this.id;
    }

    public void makeId(int id){
        // this method sets the id, after creating it
        // scheme: zipCode_id
        this.id = this.zipCode + DELIMITER + id;
    }

    public double getLatitude(){
        return this.latitude;
    }

    public void setLatitude(double lat){
        this.latitude = lat;
    }

    public double getLongitude(){
        return this.longitude;
    }

    public void setLongitude(double longitude){
        this.longitude = longitude;
    }

    @Override
    public String toString() {
        return new StringBuilder()
                .append(this.name)
                .append(DELIMITER_COMMA)
                .append(this.id)
                .append(DELIMITER_COMMA)
                .append(this.latitude)
                .append(DELIMITER_COMMA)
                .append(this.longitude)
                .toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Location location = (Location) o;
        return zipCode == location.zipCode &&
                Objects.equals(id, location.id) &&
                Objects.equals(name, location.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, zipCode);
    }
}
