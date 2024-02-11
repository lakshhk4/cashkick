"use client";
import { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analytics = ({ player_name }) => {
  const customData = {
    "Aitana Bonmatí Conca": { positive: 20, negative: 5, neutral: 13 },
    "Kylian Mbappé": { positive: 20, negative: 6, neutral: 12 },
    "Erling Haaland": { positive: 30, negative: 6, neutral: 11 },
    "Lionel Messi": { positive: 80, negative: 3, neutral: 7 },
    "Virgil van Dijk": { positive: 10, negative: 18, neutral: 11 },
    "Alexia Putellas Segura": { positive: 1, negative: 4, neutral: 0 },
    "Kevin De Bruyne": { positive: 2, negative: 3, neutral: 0 },
    "Jude Bellingham": { positive: 30, negative: 1, neutral: 12 },
    "Samantha May Kerr": { positive: 1, negative: 3, neutral: 0 },
    "Edson Arantes Nascimento": { positive: 20, negative: 1, neutral: 13 },
    "Ronaldo de Assis Moreira": { positive: 3, negative: 1, neutral: 0 },
    "C. Ronaldo dos Santos Aveiro": { positive: 10, negative: 3, neutral: 14 },
    "Wendie Renard": { positive: 10, negative: 6, neutral: 9 },
    "Ona Batlle": { positive: 5, negative: 5, neutral: 0 },
    "Alisson Ramses Becker": { positive: 10, negative: 6, neutral: 11 },
    "Mia Hamm": { positive: 1, negative: 5, neutral: 0 },
    "Sophia Smith": { positive: 40, negative: 12, neutral: 9 },
    "Ronaldo Luís Nazário de Lima": { positive: 40, negative: 1, neutral: 11 },
    "Zinedine Zidane": { positive: 20, negative: 5, neutral: 13 },
    "Johan Cruyff": { positive: 20, negative: 4, neutral: 13 },
    "Paolo Maldini": { positive: 10, negative: 2, neutral: 14 },
    "Jeremie Frimpong": { positive: 60, negative: 4, neutral: 9 },
    "Theo Hernández": { positive: 20, negative: 3, neutral: 13 },
    "Millie Bright": { positive: 50, negative: 5, neutral: 10 },
    "Mary Earps": { positive: 2, negative: 4, neutral: 0 },
    "Ferenc Puskás": { positive: 40, negative: 1, neutral: 11 },
    "Gerd Müller": { positive: 5, negative: 4, neutral: 0 },
    "Robert Lewandowski": { positive: 40, negative: 3, neutral: 11 },
    "Rio Ferdinand": { positive: 40, negative: 12, neutral: 9 },
    "Patrick Vieira": { positive: 4, negative: 4, neutral: 15 },
    "Petr Čech": { positive: 60, negative: 1, neutral: 7 },
    "Neymar da Silva Santos Jr.": { positive: 4, negative: 1, neutral: 0 },
    "Lev Yashin": { positive: 4, negative: 5, neutral: 0 },
    "Thierry Henry": { positive: 60, negative: 12, neutral: 7 },
    "Luka Modrić": { positive: 50, negative: 4, neutral: 10 },
    "Roberto Carlos da Silva Rocha": { positive: 1, negative: 1, neutral: 0 },
    "Vinícius José de Oliveira Júnior": {
      positive: 20,
      negative: 6,
      neutral: 12,
    },
    "Mohamed Salah": { positive: 4, negative: 2, neutral: 0 },
    "Kadidiatou Diani": { positive: 60, negative: 3, neutral: 9 },
    "Philipp Lahm": { positive: 40, negative: 12, neutral: 9 },
    "Franck Ribéry": { positive: 10, negative: 1, neutral: 10 },
    "Rui Manuel César Costa": { positive: 10, negative: 6, neutral: 13 },
    "Vincent Kompany": { positive: 30, negative: 12, neutral: 10 },
    "Jari Litmanen": { positive: 70, negative: 1, neutral: 8 },
    "Paul Scholes": { positive: 50, negative: 5, neutral: 10 },
    "Xabier Alonso Olano": { positive: 1, negative: 1, neutral: 0 },
    "Manuel Locatelli": { positive: 20, negative: 5, neutral: 13 },
    "Florian Thauvin": { positive: 2, negative: 6, neutral: 14 },
    "Ashley Cole": { positive: 3, negative: 5, neutral: 0 },
    "Ronald Koeman": { positive: 10, negative: 3, neutral: 13 },
    "Grace Geyoro": { positive: 30, negative: 1, neutral: 12 },
    "Pedro González López": { positive: 10, negative: 5, neutral: 14 },
    "Bruno Miguel Borges Fernandes": { positive: 20, negative: 6, neutral: 5 },
    "Antoine Griezmann": { positive: 30, negative: 1, neutral: 1 },
    "Federico Valverde": { positive: 60, negative: 2, neutral: 9 },
    "Mario Götze": { positive: 20, negative: 12, neutral: 11 },
    "Abedi Ayew": { positive: 10, negative: 24, neutral: 10 },
    "Lucimar da Silva Ferreira": { positive: 20, negative: 2, neutral: 13 },
    "Rudi Völler": { positive: 20, negative: 12, neutral: 11 },
    "David Ginola": { positive: 5, negative: 2, neutral: 0 },
    "Jürgen Kohler": { positive: 10, negative: 5, neutral: 14 },
    "Jean-Pierre Papin": { positive: 10, negative: 12, neutral: 12 },
    "Jair Ventura Filho": { positive: 30, negative: 6, neutral: 11 },
    "Peter Schmeichel": { positive: 20, negative: 12, neutral: 11 },
    "Carles Puyol Saforcada": { positive: 2, negative: 2, neutral: 0 },
    "Gary Lineker": { positive: 30, negative: 42, neutral: 5 },
    "Sócrates Vieira de Oliveira": { positive: 10, negative: 2, neutral: 3 },
    "Eric Cantona": { positive: 3, negative: 1, neutral: 0 },
    "Hugo Sánchez": { positive: 10, negative: 2, neutral: 14 },
    "Ricardo Izecson dos Santos Leite": {
      positive: 10,
      negative: 2,
      neutral: 3,
    },
    "Hristo Stoichkov": { positive: 40, negative: 4, neutral: 7 },
    "Fabio Cannavaro": { positive: 10, negative: 6, neutral: 13 },
    "Alessandro Nesta": { positive: 20, negative: 1, neutral: 13 },
    "Javier Zanetti": { positive: 3, negative: 3, neutral: 0 },
    "Alan Shearer": { positive: 80, negative: 2, neutral: 7 },
    "Gianluca Vialli": { positive: 30, negative: 4, neutral: 12 },
    "Rodrigo Hernández Cascante": { positive: 3, negative: 3, neutral: 0 },
    "Rúben Santos Gato Alves Dias": { positive: 20, negative: 4, neutral: 13 },
    "Ada Martine Stolsmo Hegerberg": { positive: 3, negative: 1, neutral: 15 },
    "Trinity Rodman": { positive: 60, negative: 18, neutral: 6 },
    "Castello Lukeba": { positive: 4, negative: 4, neutral: 15 },
    "Khvicha Kvaratskhelia": { positive: 40, negative: 2, neutral: 11 },
    "Phil Foden": { positive: 30, negative: 12, neutral: 6 },
  };

  console.log(player_name);

  function parseData(name) {
    const currentPlayerData = customData[name];

    console.log(currentPlayerData);

let uniqueData;

    if (currentPlayerData) {
      uniqueData = [
        { name: "Positive", value: currentPlayerData.positive },
        { name: "Negative", value: currentPlayerData.negative },
        { name: "Neutral", value: currentPlayerData.neutral },
      ];
    } else {
        uniqueData = [
            { name: "Positive", value: 5 },
            { name: "Negative", value: 3 },
            { name: "Neutral", value: 5 },
          ];
    }

    return uniqueData;
  }

  return (
    <div className="m-20">
      <span className="text-black m-20">{player_name}</span>
      <BarChart width={730} height={250} data={parseData(player_name)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default Analytics;
