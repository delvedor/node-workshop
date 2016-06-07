# node-workshop

## API

#### timeseries.insert  
Insert a new datapoint,  
returns a callback.

Usage:  
```javascript
timeseries.insert(object, function (err, value) {
  if (err) console.log(err)
})
```  
where object is:  
```javascript
{
  category: string,
  time: Date,
  data: object
}
```


#### timeseries.fetch  
Fetch all events between two dates  
returns a callback.


Usage:  
```javascript
timeseries.fetch(object, function (err, value) {
  if(err) console.log(err)
})
```  
where object is:  
```javascript
{
  category: string,
  from: Date,
  to: Date
}
```
