package com.bookstore.backend.mappers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;

public interface IBaseMapper<E, D>
{
    D toModel(E entity);

    E toEntity(D model);

    List<D> toModelList(List<E> entities);

    List<E> toEntityList(List<D> models);

    default Page<D> toModelPage(Page<E> entityPage)
    {
        if (entityPage == null)
        {
            return Page.empty();
        }

        return new PageImpl<>(toModelList(entityPage.getContent()), entityPage.getPageable(), entityPage.getTotalElements());
    }
}
