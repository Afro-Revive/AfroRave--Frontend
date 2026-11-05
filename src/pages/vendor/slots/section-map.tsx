import { cn } from "@/lib/utils"

export function VendorSectionMap() {
    const sections = [
        { id: 'P01', name: 'Food Trucks', color: 'bg-red-400' },
        { id: 'P02', name: 'Food Trucks', color: 'bg-red-400' },
        { id: 'P03', name: 'Food Trucks', color: 'bg-red-400' },
        { id: 'P04', name: 'Food Trucks', color: 'bg-red-400' },
        { id: 'P05', name: 'Food Trucks', color: 'bg-red-400' },
        { id: 'S06', name: 'Drinks', color: 'bg-sky-400' },
        { id: 'S07', name: 'Drinks', color: 'bg-sky-400' },
        { id: 'S08', name: 'Drinks', color: 'bg-sky-400' },
        { id: 'P12', name: 'Merch', color: 'bg-green-300' },
        { id: 'M01', name: 'Merch', color: 'bg-green-300' },
        { id: 'M03', name: 'Merch', color: 'bg-green-300' },
        { id: 'M04', name: 'Merch', color: 'bg-green-300' },
        { id: 'S10', name: 'Souvenirs', color: 'bg-yellow-400' },
        { id: 'S07', name: 'Crafts', color: 'bg-yellow-400' },
        { id: 'V01', name: 'VIP Bar', color: 'bg-purple-300' },
        { id: 'S11', name: 'Snacks', color: 'bg-gray-200' },
        { id: 'S12', name: 'Snacks', color: 'bg-gray-200' },
    ]

    return (
        <div className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-bold text-sm mb-4 text-gray-500 font-inter-tight">Section Map</h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 w-full">
                {sections.map((section, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "aspect-square flex flex-col items-center justify-center p-1 text-center rounded-[4px] cursor-pointer hover:opacity-80 transition-opacity",
                            section.color
                        )}
                    >
                        <span className="font-bold text-[10px] md:text-xs text-black/80">{section.id}</span>
                        <span className="text-[8px] md:text-[10px] text-black/60 leading-tight">{section.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
