package Model;

import java.util.Objects;
import static Constants.Characters.*;

public final class Location {

    private String id;
    private String name;
    private String state;
    private final String country = "AT";
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
        this.id = this.zipCode + UNDERSCORE + id;
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

    public String getCountry(){
        return country;
    }

    public String getState(){
        return this.state;
    }

    public void setState(String s){
        this.state = s;
    }

    @Override
    public String toString() {
        return new StringBuilder()
                .append(this.name)
                .append(COMMA_SPACE)
                .append(this.id)
                .append(COMMA_SPACE)
                .append(this.latitude)
                .append(COMMA_SPACE)
                .append(this.longitude)
                .append(COMMA_SPACE)
                .append(this.getState())
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
