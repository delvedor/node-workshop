# node-workshop

## API

- timeseries.insert
Insert a new datapoint
```json
{
  category: string,
  time: Date,
  data: object
}
```
Usage:
timeseries.insert(object)

- timeseries.fetch
Fetch all events between two dates (in ISO 8601 string)
```json
{
  category: string,
  from: Date,
  to: Date
}
```
Usage:
timeseries.fetch(object)

