<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CreateSellerTablePage extends Command
{

    protected $signature = 'create:seller-panel-table-page {name}'; // Example signature

    protected $description = 'Creates a new prebuilt file with custom name';



    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dir = "seller-panel/pages";


        // placeholder
        $placeholderPage = file_get_contents("$dir/Placeholder/PlaceholdersPage.tsx");
        $placeholderTable = file_get_contents("$dir/Placeholder/PlaceholdersTable.tsx");
        $placeholderCreateModal = file_get_contents("$dir/Placeholder/CreatePlaceholderModal.tsx");
        $placeholderEditModal = file_get_contents("$dir/Placeholder/EditPlaceholderModal.tsx");

        // arg details
        $name = $this->argument("name");
        $pName = $name . "s";

        // create file
        $createFileDir =  "$dir/$pName"."Page";
        // if already has dir
        if (is_dir($createFileDir)) {
            return $this->error("File already exists");
        }
        // create dir
        mkdir($createFileDir);

        // page file
        $pageFile = str_replace("PlaceholdersPage", $pName . "Page", $placeholderPage);
        $pageFile = str_replace("Placeholders", "$pName", $pageFile);
        $pageFile = str_replace("Placeholder", "$name", $pageFile);
        // put file
        file_put_contents("$createFileDir/$pName" . "Page.tsx", $pageFile);



        // table file
        $tableFile = str_replace("Placeholders", $pName . "Page", $placeholderTable);
        $tableFile = str_replace("Placeholder", "$name", $tableFile);
        // put file
        file_put_contents("$createFileDir/$pName" . "Table.tsx", $tableFile);
    }
}
