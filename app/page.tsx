import { ModeToggle } from '@/components/ModeToggle';
import GlobalStates from '@/components/GlobalStates';
import { ToDo } from '@/components/ToDo';

export default function Home() {
    return (
        <GlobalStates>
            <header className="flex pr-4 py-4 border-b">
                <nav className="flex gap-2 ml-auto">
                    <ModeToggle />
                </nav>
            </header>
            <ToDo />
        </GlobalStates>
    );
}
