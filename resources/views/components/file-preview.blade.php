<!-- resources/views/components/file-preview.blade.php -->
<div>
    @php
        $record = $getRecord();
    @endphp
    
    @if($record->type === 'image')
        <div class="w-20 h-10">
            <a href="{{ Storage::url($record->location) }}" target="_blank">
                <img 
                    src="{{ Storage::url($record->location) }}" 
                    alt="Image Preview"
                    class="w-full h-full object-cover rounded-lg"
                />
            </a>
        </div>
    @else
    <a href="{{ Storage::url($record->location) }}" target="_blank" class="block w-20 h-10">
        <div class="w-full h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="none" stroke="#ff2f2f" strokeWidth="2" d="M4.998 9V1H19.5L23 4.5V23H4M18 1v5h5M3 12h1.5c2 0 2.25 1.25 2.25 2s-.25 2-2.25 2H3.25v2H3zm6.5 6v-6h1.705c1.137 0 2.295.5 2.295 3s-1.158 3-2.295 3zm7 1v-7h4m-4 3.5h3"/></svg>
        </div>
    </a>
    @endif
</div>