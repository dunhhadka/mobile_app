package org.example.management.management.application.model;

import lombok.Setter;

@Setter
public class PageRequest {
    private int pageSize;
    private int pageNumber;

    public int getPageSize() {
        if (this.pageSize == 0) this.pageSize = 10;
        return Math.min(pageSize, 50);
    }

    public int getPageNumber() {
        if (this.pageNumber == 0) this.pageNumber = 1;
        return this.pageNumber;
    }
}
