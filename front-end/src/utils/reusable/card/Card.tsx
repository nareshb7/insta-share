import React from 'react';
import './styles.scss'

// Define a generic CardProps interface
interface CardProps<T> {
  data: T[]; // An array of data of type T
  render: (item: T, index?: number) => React.ReactNode; // A render function for each item
}

// Create the Card component
function Card<T>({ data, render }: CardProps<T>) {
  return (
    <div className='card'>
      {data.map((item, index) => (
        <div key={index} className='card-item'>
          {render(item, index)}
        </div>
      ))}
    </div>
  );
}

export default Card;
