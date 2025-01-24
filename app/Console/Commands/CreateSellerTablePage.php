<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CreateSellerTablePage extends Command
{

    protected $signature = 'create:seller-panel-table-page {tableName} {--name=}'; // Example signature

    protected $description = 'Creates a new prebuilt file with custom name';



    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dir = "seller-panel/pages";


        // placeholder
        $placeholderPage = file_get_contents("$dir/PlaceholdersPage/PlaceholdersPage.tsx");
        $placeholderTable = file_get_contents("$dir/PlaceholdersPage/PlaceholdersTable.tsx");
        $placeholderTablePagination = file_get_contents("$dir/PlaceholdersPage/PlaceholdersTablePagination.tsx");
        $placeholderCreateModal = file_get_contents("$dir/PlaceholdersPage/CreatePlaceholderModal.tsx");
        $placeholderEditModal = file_get_contents("$dir/PlaceholdersPage/EditPlaceholderModal.tsx");
        $placeholderDeleteModal = file_get_contents("$dir/PlaceholdersPage/DeletePlaceholderModal.tsx");

        // arg details
        $pName = $this->argument("tableName");
        $name = $this->option('name') ?? substr_replace($pName, "", -1);

        // create file
        $createFileDir =  "$dir/$pName"."Page";
        // if already has dir
        if (is_dir($createFileDir)) {
            return $this->error("Directory is not empty");
        }
        // create dir
        mkdir($createFileDir);

        // page file
        $pageFile = str_replace("Placeholders", "$pName", $placeholderPage);
        $pageFile = str_replace("Placeholder", "$name", $pageFile);
        // put file
        file_put_contents("$createFileDir/$pName" . "Page.tsx", $pageFile);

        // table file
        $tableFile = str_replace("Placeholders", $pName, $placeholderTable);
        $tableFile = str_replace("Placeholder", "$name", $tableFile);
        $tableFile = str_replace("placeholders", strtolower($pName), $tableFile);
        $tableFile = str_replace("placeholder", strtolower($name), $tableFile);
        // put file
        file_put_contents("$createFileDir/$pName" . "Table.tsx", $tableFile);

        // table pagination file
        $tablePaginationFile = str_replace("Placeholders", $pName, $placeholderTablePagination);
        $tablePaginationFile = str_replace("Placeholder", "$name", $tablePaginationFile);
        // put file
        file_put_contents("$createFileDir/$pName" . "TablePagination.tsx", $tablePaginationFile);

        // create modal file
        $createModalFile = str_replace("Placeholders", $pName, $placeholderCreateModal);
        $createModalFile = str_replace("Placeholder", "$name", $createModalFile);
        // put file
        file_put_contents("$createFileDir/" ."Create". $name . "Modal.tsx", $createModalFile);

        // edit modal file
        $editModalFile = str_replace("Placeholders", $pName, $placeholderEditModal);
        $editModalFile = str_replace("Placeholder", "$name", $editModalFile);
        $editModalFile = str_replace("placeholder", strtolower($name), $editModalFile);
        // put file
        file_put_contents("$createFileDir/" . "Edit" . $name . "Modal.tsx", $editModalFile);

        // create modal file
        $deleteModalFile = str_replace("Placeholders", $pName, $placeholderDeleteModal);
        $deleteModalFile = str_replace("Placeholder", "$name", $deleteModalFile);
        $deleteModalFile = str_replace("placeholder", strtolower($name), $deleteModalFile);
        // put file
        file_put_contents("$createFileDir/" . "Delete" . $name . "Modal.tsx", $deleteModalFile);

        return $this->info("$name files has been generated");
    }
}
