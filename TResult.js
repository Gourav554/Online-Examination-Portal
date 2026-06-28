const students = [
["Allen John","STU101",88],
["John Smith","STU102",76],
["Mary Williams","STU103",68],
["David Brown","STU104",92],
["Sophia Davis","STU105",81],
["James Miller","STU106",54],
["Michael Wilson","STU107",28],
["Emma Taylor","STU108",95]
];

const table = document.getElementById("resultTable");

students.forEach((student,index)=>{

```
let percentage = student[2];
let result = percentage >= 40 ? "Passed" : "Failed";

table.innerHTML += `
    <tr>
        <td>${index+1}</td>
        <td>${student[0]}</td>
        <td>${student[1]}</td>
        <td>${student[2]}</td>
        <td>100</td>
        <td>${percentage}%</td>
        <td class="${result === 'Passed' ? 'pass' : 'fail'}">
            ${result}
        </td>
    </tr>
`;
```

});
