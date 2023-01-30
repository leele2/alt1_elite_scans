import React, { useState } from "react"

type ScanResult = "triple" | "double" | "single" | "none"

type Node = {
    name: string
    mapImage: string
} & Record<ScanResult, number[]>

type CheckMap = {
    node: typeof Node["name"]
    triple?: CheckMap
    double?: CheckMap
    single?: CheckMap
    none?: CheckMap
}

type Location = {
    name: string
    nodes: Node[]
    checkMap: CheckMap
}

type Step = {
    node: typeof Node["name"]
    result: ScanResult
}

const locations: Location[] = [
    {
        name: "Dorgesh-Kaan",
        nodes: [
            {
                name: "A",
                mapImage: "./imgs/Dorgesh-Kaan/all.png",
                triple: [1, 2, 3, 4, 5],
                double: [6, 7],
                single: [8, 9, 10, 11, 12],
                none: [13, 14, 15, 16, 17, 18, 19, 20]
            },
            {
                name: "B",
                mapImage: "./imgs/Dorgesh-Kaan/all.png",
                triple: [6],
                double: [7],
                single: [],
                none: []
            },
            {
                name: "C",
                mapImage: "./imgs/Dorgesh-Kaan/all.png",
                triple: [],
                double: [8, 9, 10],
                single: [11, 12],
                none: []
            },
            {
                name: "D",
                mapImage: "./imgs/Dorgesh-Kaan/all.png",
                triple: [],
                double: [8, 9, 10, 11],
                single: [12],
                none: []
            },
            {
                name: "E",
                mapImage: "./imgs/Dorgesh-Kaan/all.png",
                triple: [8, 9],
                double: [10],
                single: [],
                none: []
            },
            {
                name: "F",
                mapImage: "./imgs/Dorgesh-Kaan/all.png",
                triple: [13, 14],
                double: [14, 15, 19],
                single: [],
                none: []
            },
            {
                name: "G",
                mapImage: "./imgs/Dorgesh-Kaan/all.png",
                triple: [14],
                double: [15, 19],
                single: [],
                none: []
            },
            {
                name: "H",
                mapImage: "./imgs/Dorgesh-Kaan/all.png",
                triple: [15],
                double: [16, 17, 19],
                single: [18, 20],
                none: []
            },
            {
                name: "I",
                mapImage: "./imgs/Dorgesh-Kaan/all.png",
                triple: [],
                double: [18],
                single: [20],
                none: []
            }
        ],
        checkMap: {
            node: "A",
            double: { node: "B" },
            single: {
                node: "C",
                double: {
                    node: "D",
                    double: { node: "E" }
                },
                single: { node: "D" }
            },
            none: {
                node: "F",
                double: {
                    node: "G",
                    double: { node: "H" }
                },
                single: {
                    node: "H",
                    single: { node: "I" }
                }
            }
        }
    }
]

function App() {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [location, setLocation] = useState<typeof locations[number]>()
    const [steps, setSteps] = useState<Step[]>([])

    let currentStep = location?.checkMap
    let possible = location
        ? (["triple", "double", "single", "none"] as ScanResult[]).flatMap(
              (result) => location.nodes.find(({ name }) => name === location.checkMap.node)[result]
          )
        : []

    for (let i = 0; i < steps.length; i++) {
        const node = location.nodes.find(({ name }) => name === steps[i].node)

        if (node) {
            possible = possible.filter((item) => node[steps[i].result].includes(item))
        }

        currentStep = currentStep[steps[i].result]
    }

    return (
        <>
            <h1 className="nistext">Eliete scans</h1>

            <div
                className="nisbutton"
                onClick={() => {
                    setDropdownOpen(!dropdownOpen)
                    setLocation(undefined)
                    setSteps([])
                }}
            >
                Region select
            </div>

            {dropdownOpen && (
                <div style={{ display: "flex", flexDirection: "column", border: "solid", margin: 5, padding: 5 }}>
                    {locations.map((option) => (
                        <div key={option.name} className="nisbutton" onClick={() => setLocation(option)}>
                            {option.name}
                        </div>
                    ))}
                </div>
            )}

            {currentStep && (
                <div>
                    <h4>{`Check ${currentStep.node}`}</h4>
                    <img style={{ maxHeight: 650 }} src={location?.nodes.find((item) => item.name === currentStep?.node)?.mapImage} />

                    <div style={{ display: "flex" }}>
                        {(["triple", "double", "single", "none"] as ScanResult[]).map((result) => (
                            <div key={result} className="nisbutton" onClick={() => setSteps([...steps, { node: currentStep.node, result }])}>
                                {result}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {possible.join(", ")}
        </>
    )
}

export default App
