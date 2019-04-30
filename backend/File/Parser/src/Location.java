import java.util.Objects;

public final class Location {

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
        this.id = this.zipCode + "_" + id;
    }

    @Override
    public String toString() {
        return this.name + ", " + this.zipCode + ", " + this.id;
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
