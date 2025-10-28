export default function SelectCity({ setCoordinates, setCityName }) {
    const coordinates = [
        { id: 1, city: 'Jakarta', latitude: 6.1944, longitude: 106.8229 },
        { id: 2, city: 'Bali', latitude: -8.3405, longitude: 115.0920 },
        { id: 3, city: 'Bandung', latitude: -6.9175, longitude: 107.6191 },
        { id: 4, city: 'Surabaya', latitude: -7.2575, longitude: 112.7521 },
        { id: 5, city: 'Yogyakarta', latitude: -7.7956, longitude: 110.3695 },
        { id: 6, city: 'Medan', latitude: 3.5952, longitude: 98.6722 },
        { id: 7, city: 'Makassar', latitude: -5.1477, longitude: 119.4327 },
        { id: 8, city: 'Semarang', latitude: -6.9667, longitude: 110.4167 },
        { id: 9, city: 'Palembang', latitude: -2.9761, longitude: 104.7754 },
        { id: 10, city: 'Balikpapan', latitude: -1.2678, longitude: 116.8310 },
    ];
    // console.log(JSON.stringify(coordinates));
    

    function handleChange(event) {
        const selectedCoord = JSON.parse(event.target.value);
        // console.log(selectedCoord);
        
        setCoordinates({
            latitude: selectedCoord.latitude,
            longitude: selectedCoord.longitude,
        });
        setCityName(selectedCoord.city);
    }
    
    return(
        <>
            <div className="relative">
                <select
                    onChange={handleChange}
                    className="appearance-none px-3 py-2 pr-10 rounded-lg border border-white bg-transparent text-white text-lg cursor-pointer"
                >
                    {
                        coordinates.map((coord) => (
                            <option value={JSON.stringify(coord)} key={coord.id} className="text-black">{coord.city}</option>
                        )
                    )}
                </select>
                <div
                    className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white"
                >
                    ▼
                </div>
            </div>
        </>
    )
}