import java.util.Objects;

public final class Location {

    private static final String DELIMITER_COMMA = ", ";
    private static final String DELIMITER = "_";

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

    public int getZipCode(){
        return this.zipCode;
    }

    public void makeId(int id){
        this.id = this.zipCode + DELIMITER + id;
    }

    public void setLatitude(double lat){
        this.latitude = lat;
    }

    public void setLongitude(double longitude){
        this.longitude = longitude;
    }

    @Override
    public String toString() {
        return this.name + DELIMITER_COMMA + this.zipCode + DELIMITER_COMMA + this.id + DELIMITER_COMMA + this.latitude + DELIMITER_COMMA + this.longitude;
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
