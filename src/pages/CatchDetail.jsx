import { useParams } from "react-router-dom";

const CatchDetailPage = () => {
  // const { cruiseId, stationId } = useParams();
  // const { data: cruise, } = useGetCruiseById(cruiseId);
  // const {
  //   data: station,
  //   isLoading: stationLoading,
  //   isError: stationError,
  //   error: errorStation
  // } = useGetStationById(stationId);
  return (
    <p>Catch list</p>
  );
}

export default CatchDetailPage;

// {
//   "speciesId": 1,
//   "aggregateWeightKg": 100.5,
//   "individuals": [
//     {
//       "lengthCm": 35.4,
//       "bioSample": {
//         "sampleName": "BIO001",
//         "sampleTypeId": 3,
//         "notes": "Sample taken from dorsal fin."
//       }
//     },
//     {
//       "lengthCm": 40.2,
//       "bioSample": {
//         "sampleName": "BIO002",
//         "sampleTypeId": 1,
//         "notes": "Sample taken for age analysis."
//       }
//     }
//   ]
// },