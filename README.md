# node-workshop

## API

#### timeseries.insert  
Insert a new datapoint,  
returns a status object.

Usage:  
`timeseries.insert(object)`  
where object is:  
```javascript
{
  category: string,
  time: Date,
  data: object
}
```


#### timeseries.fetch  
Fetch all events between two dates (in ISO 8601 string)  
returns a structured object with the result or an error.


Usage:  
`timeseries.fetch(object)`  
where object is:  
```javascript
{
  category: string,
  from: Date,
  to: Date
}
```
