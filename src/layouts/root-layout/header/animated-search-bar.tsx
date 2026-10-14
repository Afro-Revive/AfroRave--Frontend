import { AnimatePresence, motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { getRoutePath } from '@/config/get-route-path'
import { eventCategories } from '@/pages/creators/edit-event/constant'

interface AnimatedSearchBarProps {
    isOpen: boolean
    onClose: () => void
}


export function AnimatedSearchBar({ isOpen, onClose }: AnimatedSearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const [query, setQuery] = useState('')
    const [filterType, setFilterType] = useState<string>('category')
    const [filterOpen, setFilterOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    // One category: the events API filters by a single, exact category.
    const [selectedCategory, setSelectedCategory] = useState('')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => { inputRef.current?.focus() }, 300)
        } else {
            setFilterOpen(false)
        }
    }, [isOpen])

    const handleFilterTypeChange = (val: string) => {
        setFilterType(val)
        setFilterOpen(false)
    }

    // Picking the selected category again clears it.
    const toggleCategory = (cat: string) => {
        setSelectedCategory(prev => (prev === cat ? '' : cat))
    }

    const applyAndNavigate = (overrideDate?: Date) => {
        const params = new URLSearchParams()

        if (query.trim()) params.set('q', query.trim())

        const date = overrideDate ?? (filterType === 'date' ? selectedDate : undefined)
        if (date) {
            const y = date.getFullYear()
            const m = String(date.getMonth() + 1).padStart(2, '0')
            const d = String(date.getDate()).padStart(2, '0')
            params.set('date', `${y}-${m}-${d}`)
        }

        if (filterType === 'category' && selectedCategory) {
            params.set('category', selectedCategory)
        }

        if (filterType === 'price') {
            if (minPrice) params.set('minPrice', minPrice)
            if (maxPrice) params.set('maxPrice', maxPrice)
        }

        navigate(`${getRoutePath('events')}?${params.toString()}`, { state: { fromSearch: true } })
        setFilterOpen(false)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={onClose} />

                    <motion.div
                        initial={{ y: -150, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -150, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-[85px] max-md:top-4 left-0 right-0 mx-auto w-[80%] max-md:w-[95%] max-w-4xl h-[60px] bg-[#1A1A1A] z-[70] rounded-2xl max-md:rounded-[30px] flex items-center px-4 md:px-6 shadow-2xl border border-white/5"
                    >
                        <Search className="w-5 h-5 text-[#888888] shrink-0 mr-3 md:mr-4 hidden md:block" />

                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search events..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') applyAndNavigate() }}
                            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[#888888] text-sm md:text-base h-full font-normal min-w-0 pl-1"
                        />

                        <div className="w-[1px] h-6 bg-[#333333] mx-2 md:mx-4 hidden md:block" />

                        <Select value={filterType} onValueChange={handleFilterTypeChange}>
                            <SelectTrigger className="w-auto min-w-[80px] md:min-w-[120px] border-none bg-transparent hover:bg-transparent shadow-none focus:ring-0 gap-2 px-0 text-white h-auto p-0 flex items-center [&_svg]:!text-white [&_svg]:!opacity-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-xs md:hidden mr-1 whitespace-nowrap">by</span>
                                    <SelectValue placeholder="Category" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-[#444444] border-none text-white rounded-lg shadow-xl min-w-[150px]">
                                <SelectItem value="category" className="data-[highlighted]:bg-transparent data-[highlighted]:outline data-[highlighted]:outline-1 data-[highlighted]:outline-white focus:bg-transparent cursor-pointer py-3">Category</SelectItem>
                                <div className="h-[1px] bg-white/10 mx-2" />
                                <SelectItem value="price" className="data-[highlighted]:bg-transparent data-[highlighted]:outline data-[highlighted]:outline-1 data-[highlighted]:outline-white focus:bg-transparent cursor-pointer py-3">Price</SelectItem>
                                <div className="h-[1px] bg-white/10 mx-2" />
                                <SelectItem value="date" className="data-[highlighted]:bg-transparent data-[highlighted]:outline data-[highlighted]:outline-1 data-[highlighted]:outline-white focus:bg-transparent cursor-pointer py-3">Date</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="w-[1px] h-6 bg-[#333333] mx-2 md:mx-3" />

                        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    className={cn(
                                        'p-1.5 rounded-lg transition-colors shrink-0',
                                        filterOpen
                                            ? 'bg-white/15 text-white'
                                            : 'text-white hover:bg-white/10'
                                    )}
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                </button>
                            </PopoverTrigger>

                            <PopoverContent
                                className="bg-[#1A1A1A] border border-white/10 text-white p-0 rounded-xl shadow-2xl z-[80] w-auto"
                                align="end"
                                sideOffset={14}
                            >
                                {filterType === 'date' && (
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => {
                                            setSelectedDate(date)
                                            if (date) applyAndNavigate(date)
                                        }}
                                        classNames={{
                                            caption_label: 'text-sm font-medium text-white',
                                            head_cell: 'text-white/40 rounded-md w-8 font-normal text-[0.8rem]',
                                            day: 'size-8 p-0 font-normal aria-selected:opacity-100 text-white hover:bg-white/10 rounded-md',
                                            day_selected: 'bg-white !text-black hover:bg-white hover:text-black focus:bg-white focus:text-black',
                                            day_today: 'bg-white/10 text-white',
                                            day_outside: 'text-white/20 aria-selected:text-white/20',
                                            day_disabled: 'text-white/20 opacity-50',
                                            nav_button: 'size-7 bg-transparent p-0 opacity-60 hover:opacity-100 text-white hover:bg-white/10 rounded',
                                        }}
                                    />
                                )}

                                {filterType === 'price' && (
                                    <div className="p-4 flex flex-col gap-3 w-[230px]">
                                        <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">Price Range (₦)</p>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="number"
                                                placeholder="Min ₦"
                                                value={minPrice}
                                                onChange={e => setMinPrice(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <span className="text-white/30 shrink-0">—</span>
                                            <input
                                                type="number"
                                                placeholder="Max ₦"
                                                value={maxPrice}
                                                onChange={e => setMaxPrice(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                        </div>
                                        <button
                                            onClick={() => applyAndNavigate()}
                                            className="w-full bg-white text-black text-sm font-semibold py-2 rounded-lg hover:bg-white/90 transition-colors"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                )}

                                {filterType === 'category' && (
                                    <div className="p-4 flex flex-col gap-3 w-[260px]">
                                        <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">Category</p>
                                        {/* 32 categories: scroll inside the popover rather than run off the screen. */}
                                        <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                                            {eventCategories.map(({ value: cat, label }) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    aria-pressed={selectedCategory === cat}
                                                    onClick={() => toggleCategory(cat)}
                                                    className={cn(
                                                        'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                                                        selectedCategory === cat
                                                            ? 'bg-white text-black border-white'
                                                            : 'bg-transparent text-white/70 border-white/20 hover:border-white/50 hover:text-white'
                                                    )}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => applyAndNavigate()}
                                            className="w-full bg-white text-black text-sm font-semibold py-2 rounded-lg hover:bg-white/90 transition-colors"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>

                        <button
                            onClick={onClose}
                            className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors md:hidden"
                        >
                            <X className="w-5 h-5 text-[#888888]" />
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
