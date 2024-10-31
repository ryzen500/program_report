<?php

namespace PaginationLibrary;

class Pagination
{
    protected $totalItems;
    protected $itemsPerPage;
    protected $currentPage;
    protected $totalPages;

    public function __construct($totalItems, $itemsPerPage = 10, $currentPage = 1)
    {
        $this->totalItems = $totalItems;
        $this->itemsPerPage = $itemsPerPage;
        $this->currentPage = max(1, $currentPage);
        $this->totalPages = ceil($this->totalItems / $this->itemsPerPage);
    }

    public function getCurrentPage()
    {
        return $this->currentPage;
    }

    public function getTotalPages()
    {
        return $this->totalPages;
    }

    public function getOffset()
    {
        return ($this->currentPage - 1) * $this->itemsPerPage;
    }

    public function getLimit()
    {
        return $this->itemsPerPage;
    }

    public function getPaginationInfo()
    {
        return [
            'total_items' => $this->totalItems,
            'items_per_page' => $this->itemsPerPage,
            'current_page' => $this->currentPage,
            'total_pages' => $this->totalPages,
            'offset' => $this->getOffset(),
        ];
    }
}
